from fastapi import APIRouter, HTTPException
import os

from app.ingestion.pdf_loader import load_pdf

router = APIRouter()

UPLOAD_DIR = "uploads"


@router.get("/documents")
def list_documents(search: str = ""):

    if not os.path.exists(UPLOAD_DIR):
        return {"documents": []}

    files = [
        file
        for file in os.listdir(UPLOAD_DIR)
        if file.endswith(".pdf")
    ]

    if search:
        files = [
            file
            for file in files
            if search.lower() in file.lower()
        ]

    return {
        "documents": files
    }


@router.get("/documents/{filename}")
def preview_document(filename: str):

    file_path = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    documents = load_pdf(file_path)

    pages = len(documents)

    preview = documents[0].page_content[:500]

    return {
    "filename": filename,
    "pages": pages,
    "size_kb": round(os.path.getsize(file_path) / 1024, 2),
    "preview": preview
    }