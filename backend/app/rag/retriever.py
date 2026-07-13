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

    citations = []

    seen = set()

    for i, doc in enumerate(results):

        print(f"\nDOC {i+1}")
        print(doc.metadata)

        context += doc.page_content + "\n\n"

        source = doc.metadata.get("source", filename)

        page = doc.metadata.get("page", 0) + 1

        # Avoid duplicate citations
        key = (source, page)

        if key not in seen:

            seen.add(key)

            citations.append({

                "filename": source,

                "page": page

            })

    return context, citations