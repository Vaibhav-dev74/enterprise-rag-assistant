from fastapi import APIRouter, UploadFile, File
import shutil
import os
import traceback

from app.ingestion.pdf_loader import load_pdf
from app.ingestion.chunker import chunk_documents
from app.vectorstore.chroma_store import store_chunks

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:

        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        documents = load_pdf(file_path)

        print("PDF Loaded:", len(documents))

        chunks = chunk_documents(documents)

        chunks = [
            c for c in chunks
            if c.page_content.strip()
        ]

        print("Chunks Generated:", len(chunks))

        if len(chunks) == 0:
            return {
                "error": "No readable text found in this PDF."
            }

        for chunk in chunks:
            chunk.metadata["source"] = file.filename

        store_chunks(chunks)

        print("Stored in ChromaDB")

        return {
            "message": "PDF uploaded successfully",
            "chunks": len(chunks)
        }

    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}