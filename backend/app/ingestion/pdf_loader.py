from langchain_community.document_loaders import PyMuPDFLoader
import re


def load_pdf(file_path):
    loader = PyMuPDFLoader(file_path)
    documents = loader.load()

    print("Pages Loaded:", len(documents))

    for i, doc in enumerate(documents):
        print(f"\n===== PAGE {i+1} =====")
        print(repr(doc.page_content[:500]))  # repr shows empty strings clearly

        text = re.sub(r"\s+", " ", doc.page_content).strip()
        doc.page_content = text

    return documents