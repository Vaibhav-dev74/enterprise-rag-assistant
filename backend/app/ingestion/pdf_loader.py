from langchain_community.document_loaders import PyMuPDFLoader
import re

def load_pdf(file_path):
    loader = PyMuPDFLoader(file_path)
    documents = loader.load()

    # Clean extracted text
    for doc in documents:
        text = doc.page_content

        # Remove extra spaces
        text = re.sub(r"\s+", " ", text)

        doc.page_content = text

    return documents