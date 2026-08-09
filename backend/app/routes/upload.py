from fastapi import APIRouter, UploadFile, File, Header
import shutil
import os
import traceback

from app.ingestion.pdf_loader import load_pdf
from app.ingestion.chunker import chunk_documents
from app.vectorstore.chroma_store import store_chunks
from app.notifications.notification_service import create_notification

router = APIRouter()

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    user_id: int | None = Header(default=None, alias="X-User-ID")
):

    try:

        # -----------------------------------------
        # Save PDF
        # -----------------------------------------

        file_path = os.path.join(
            UPLOAD_DIR,
            file.filename
        )

        with open(file_path, "wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )


        # -----------------------------------------
        # Load PDF
        # -----------------------------------------

        documents = load_pdf(
            file_path
        )

        print(
            "PDF Loaded:",
            len(documents)
        )


        # -----------------------------------------
        # Create chunks
        # -----------------------------------------

        chunks = chunk_documents(
            documents
        )

        chunks = [
            chunk
            for chunk in chunks
            if chunk.page_content.strip()
        ]

        print(
            "Chunks Generated:",
            len(chunks)
        )


        if not chunks:

            return {
                "success": False,
                "message": "No readable text found in this PDF."
            }


        # -----------------------------------------
        # Add source metadata
        # -----------------------------------------

        for chunk in chunks:

            chunk.metadata["source"] = (
                file.filename
            )


        # -----------------------------------------
        # Store in ChromaDB
        # -----------------------------------------

        store_chunks(
            chunks
        )

        print(
            "Stored in ChromaDB"
        )


        # -----------------------------------------
        # Create notification
        # -----------------------------------------

        if user_id:

            create_notification(
                user_id=user_id,
                title="Document uploaded",
                message=(
                    f"{file.filename} "
                    "was uploaded and processed successfully."
                ),
                notification_type="document"
            )

            print(
                f"Notification created for user {user_id}"
            )

        else:

            print(
                "No user_id provided. "
                "Notification was not created."
            )


        # -----------------------------------------
        # Response
        # -----------------------------------------

        return {
            "success": True,
            "message": "PDF uploaded successfully",
            "filename": file.filename,
            "chunks": len(chunks)
        }


    except Exception as e:

        traceback.print_exc()

        return {
            "success": False,
            "message": str(e)
        }