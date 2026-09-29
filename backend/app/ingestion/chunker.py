from langchain_core.documents import Document


def _split_text(text: str, chunk_size: int = 300, chunk_overlap: int = 80) -> list[str]:
    """
    Recursively splits text on natural boundaries without importing heavy ML packages.
    """
    if not text or not text.strip():
        return []

    if len(text) <= chunk_size:
        return [text.strip()]

    separators = ["\n\n", "\n", ". ", " ", ""]

    def recursive_split(s: str, sep_list: list[str]) -> list[str]:
        if len(s) <= chunk_size or not sep_list:
            return [s.strip()] if s.strip() else []

        sep = sep_list[0]
        remaining_seps = sep_list[1:]

        if sep == "":
            parts = []
            step = max(1, chunk_size - chunk_overlap)
            for i in range(0, len(s), step):
                part = s[i:i + chunk_size].strip()
                if part:
                    parts.append(part)
            return parts

        splits = s.split(sep)
        result = []
        current = ""

        for part in splits:
            candidate = f"{current}{sep}{part}" if current else part
            if len(candidate) <= chunk_size:
                current = candidate
            else:
                if current:
                    result.append(current.strip())
                if len(part) > chunk_size:
                    result.extend(recursive_split(part, remaining_seps))
                    current = ""
                else:
                    current = part

        if current and current.strip():
            result.append(current.strip())

        return result

    return [c for c in recursive_split(text, separators) if c]


def chunk_documents(documents: list[Document], chunk_size: int = 300, chunk_overlap: int = 80) -> list[Document]:
    """
    Splits input Document objects into smaller chunks preserving metadata.
    Pure Python, ultra-fast, and zero heavy dependencies.
    """
    chunked_docs = []

    for doc in documents:
        text = doc.page_content
        metadata = dict(doc.metadata) if doc.metadata else {}
        sub_chunks = _split_text(text, chunk_size=chunk_size, chunk_overlap=chunk_overlap)

        for chunk_text in sub_chunks:
            chunked_docs.append(
                Document(
                    page_content=chunk_text,
                    metadata=metadata.copy()
                )
            )

    print(f"Chunks Generated: {len(chunked_docs)}")
    return chunked_docs