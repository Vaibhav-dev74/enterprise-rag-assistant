from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vector_db = Chroma(
    persist_directory="chroma_db",
    embedding_function=embedding_model
)

def retrieve_context(query):

    results = vector_db.similarity_search(query, k=5)

    print("\n========== RETRIEVED ==========")

    for i, doc in enumerate(results):
        print(f"\nDOC {i+1}")
        print(doc.page_content[:1000])

    context = "\n\n".join(
        [doc.page_content for doc in results]
    )

    return context