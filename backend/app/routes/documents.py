from fastapi import APIRouter, HTTPException
from datetime import datetime
import os

from app.ingestion.pdf_loader import load_pdf
from app.vectorstore.chroma_store import delete_document_vectors


router = APIRouter()

UPLOAD_DIR = "uploads"


@router.get("/documents")
def list_documents(search: str = ""):

    if not os.path.exists(UPLOAD_DIR):
        return {
            "documents": []
        }

    documents = []

    for filename in os.listdir(UPLOAD_DIR):

        if not filename.lower().endswith(".pdf"):
            continue

        if search and search.lower() not in filename.lower():
            continue

        file_path = os.path.join(
            UPLOAD_DIR,
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
def preview_document(filename: str):

    filename = os.path.basename(filename)

    file_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    if not os.path.exists(file_path):

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
def delete_document(filename: str):

    filename = os.path.basename(filename)

    file_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    if not os.path.exists(file_path):

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    try:

        # --------------------------------
        # Delete vectors from ChromaDB
        # --------------------------------

        delete_document_vectors(filename)

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