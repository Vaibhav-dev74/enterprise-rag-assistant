from langchain_community.document_loaders import PyMuPDFLoader


def load_pdf(file_path):

    loader = PyMuPDFLoader(file_path)

    documents = loader.load()

    print("=" * 80)
    print("Pages Loaded:", len(documents))
    print("=" * 80)

    for i, doc in enumerate(documents):

        print(f"\nPAGE {i+1}")

        print("Length:", len(doc.page_content))

        print(repr(doc.page_content[:300]))

    return documents