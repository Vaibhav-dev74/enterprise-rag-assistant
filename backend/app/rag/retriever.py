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
        query=query,
        k=5,
        filter={
            "source": filename
        }
    )

    print("\n========== RETRIEVED ==========")

    if not results:
        return "", []

    context = ""
    citation_set = set()

    for i, doc in enumerate(results):

        print(f"\nDOC {i+1}")
        print(doc.metadata)

        context += doc.page_content + "\n\n"

        page = doc.metadata.get("page", 0) + 1
        source = doc.metadata.get("source", filename)

        citation_set.add(f"{source} (Page {page})")

    citations = sorted(list(citation_set))

    return context, citations