from langchain_text_splitters import RecursiveCharacterTextSplitter

def chunk_documents(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = text_splitter.split_documents(documents)

    print(f"Chunks Generated: {len(chunks)}")

    for i, chunk in enumerate(chunks[:3]):
        print(f"Chunk {i}: {chunk.page_content[:250]}")

    return chunks