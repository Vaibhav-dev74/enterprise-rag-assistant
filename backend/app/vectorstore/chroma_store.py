from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Create only one Chroma instance
vector_db = Chroma(
    persist_directory="chroma_db",
    embedding_function=embedding_model
)


def store_chunks(chunks):
    """
    Add new chunks to the existing database.
    """
    vector_db.add_documents(chunks)

    print(f"\nStored {len(chunks)} chunks successfully.")


def delete_document_vectors(filename):
    """
    Delete all vectors belonging to a specific document.
    """

    try:
        vector_db.delete(
            where={
                "source": filename
            }
        )

        print(f"Deleted vectors for: {filename}")

    except Exception as e:
        print(f"Error deleting vectors: {e}")