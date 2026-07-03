from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_documents(documents):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=300,
        chunk_overlap=80
    )

    chunks = splitter.split_documents(documents)

    print(f"Chunks Generated: {len(chunks)}")

    return chunks