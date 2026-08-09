from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings


# ----------------------------------------
# Embedding Model
# ----------------------------------------

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# ----------------------------------------
# ChromaDB
# ----------------------------------------

vector_db = Chroma(
    persist_directory="chroma_db",
    embedding_function=embedding_model
)


# ----------------------------------------
# Store Chunks
# ----------------------------------------

def store_chunks(chunks):
    """
    Add new document chunks to ChromaDB.
    """

    vector_db.add_documents(chunks)

    print(
        f"Stored {len(chunks)} chunks successfully."
    )


# ----------------------------------------
# Delete Document
# ----------------------------------------

def delete_document_vectors(filename):
    """
    Delete all ChromaDB vectors belonging
    to the specified PDF filename.
    """

    try:

        vector_db.delete(
            where={
                "source": filename
            }
        )

        print(
            f"Deleted vectors for: {filename}"
        )

    except Exception as e:

        print(
            f"Error deleting vectors for {filename}: {e}"
        )

        # Important:
        # Tell the documents route that deletion failed.
        raise