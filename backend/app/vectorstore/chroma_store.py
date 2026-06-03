import os
import shutil

from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

def store_chunks(chunks):

    # Delete old vectors
    if os.path.exists("chroma_db"):
        shutil.rmtree("chroma_db")

    vector_db = Chroma.from_documents(
        documents=chunks,
        embedding=embedding_model,
        persist_directory="chroma_db"
    )

    print("Stored in ChromaDB")

    return vector_db