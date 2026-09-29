import fitz
from langchain_core.documents import Document


def load_pdf(file_path):
    """
    Extracts text from PDF pages using PyMuPDF (fitz) directly.
    Lightweight, fast, and does not require heavy community dependencies.
    """
    doc = fitz.open(file_path)
    documents = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text() or ""
        documents.append(
            Document(
                page_content=text,
                metadata={
                    "source": file_path,
                    "page": page_num,
                },
            )
        )

    doc.close()

    print("=" * 80)
    print("Pages Loaded:", len(documents))
    print("=" * 80)

    return documents