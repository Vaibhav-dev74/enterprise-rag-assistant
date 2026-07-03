from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vector_db = Chroma(
    persist_directory="chroma_db",
    embedding_function=embedding_model
)


def retrieve_context(query, filename):

    results = vector_db.similarity_search(
        query,
        k=8,
        filter={
            "source": filename
        }
    )

    print("\n========== RETRIEVED ==========")

    if len(results) == 0:
        print("No matching documents found.")
        return ""

    for i, doc in enumerate(results):
        print(f"\nDOC {i+1}")
        print("Metadata:", doc.metadata)
        print(doc.page_content[:500])

    context = "\n\n".join(
        doc.page_content
        for doc in results
    )

    return context