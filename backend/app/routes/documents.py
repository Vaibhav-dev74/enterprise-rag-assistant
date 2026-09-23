from fastapi import APIRouter, HTTPException, Header
from datetime import datetime
import os

from app.ingestion.pdf_loader import load_pdf
from app.vectorstore.chroma_store import delete_document_vectors


router = APIRouter()

UPLOAD_DIR = "uploads"


@router.get("/documents")
def list_documents(
    search: str = "",
    user_id: int | None = Header(default=None, alias="X-User-ID")
):
    if not user_id:
        return {
            "documents": []
        }

    user_dir = os.path.join(UPLOAD_DIR, str(user_id))

    if not os.path.exists(user_dir):
        return {
            "documents": []
        }

    documents = []

    for filename in os.listdir(user_dir):

        if not filename.lower().endswith(".pdf"):
            continue

        if search and search.lower() not in filename.lower():
            continue

        file_path = os.path.join(
            user_dir,
            filename
        )

        if not os.path.isfile(file_path):
            continue

        stat = os.stat(file_path)

        size_bytes = stat.st_size

        size_mb = round(
            size_bytes / (1024 * 1024),
            2
        )

        uploaded_at = datetime.fromtimestamp(
            stat.st_mtime
        ).isoformat()

        documents.append(
            {
                "filename": filename,
                "size_bytes": size_bytes,
                "size_mb": size_mb,
                "uploaded_at": uploaded_at,
            }
        )

    # Newest documents first
    documents.sort(
        key=lambda x: x["uploaded_at"],
        reverse=True
    )

    return {
        "documents": documents
    }


@router.get("/documents/{filename}")
def preview_document(
    filename: str,
    user_id: int | None = Header(default=None, alias="X-User-ID")
):

    filename = os.path.basename(filename)

    file_path = None

    if user_id:
        user_path = os.path.join(UPLOAD_DIR, str(user_id), filename)
        if os.path.exists(user_path):
            file_path = user_path

    if not file_path:
        root_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(root_path):
            file_path = root_path

    if not file_path or not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    documents = load_pdf(file_path)

    pages = len(documents)

    preview = ""

    if documents:
        preview = documents[0].page_content[:500]

    size_mb = round(
        os.path.getsize(file_path)
        / (1024 * 1024),
        2
    )

    return {
        "filename": filename,
        "pages": pages,
        "size_mb": size_mb,
        "preview": preview
    }


@router.delete("/documents/{filename}")
def delete_document(
    filename: str,
    user_id: int | None = Header(default=None, alias="X-User-ID")
):

    filename = os.path.basename(filename)

    file_path = None

    if user_id:
        user_path = os.path.join(UPLOAD_DIR, str(user_id), filename)
        if os.path.exists(user_path):
            file_path = user_path

    if not file_path:
        root_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(root_path):
            file_path = root_path

    if not file_path or not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    try:

        # --------------------------------
        # Delete vectors from ChromaDB
        # --------------------------------

        delete_document_vectors(filename, user_id=user_id)

        # --------------------------------
        # Delete physical PDF
        # --------------------------------

        os.remove(file_path)

        return {
            "message": "Document deleted successfully",
            "filename": filename
        }

    except Exception as e:

        print(
            "Delete document error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to delete document"
        )