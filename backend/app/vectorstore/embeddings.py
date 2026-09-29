from langchain_core.embeddings import Embeddings
import chromadb.utils.embedding_functions as ef


class LightweightEmbeddings(Embeddings):
    """
    Lightweight, high-performance ONNX embeddings using all-MiniLM-L6-v2.
    Uses ChromaDB's native ONNX runtime without requiring heavy PyTorch or CUDA libraries.
    Consumes ~50MB RAM instead of ~600MB RAM, allowing seamless deployment on free-tier
    512MB RAM cloud instances (e.g. Render).
    """

    def __init__(self):
        self._ef = ef.DefaultEmbeddingFunction()

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return [list(map(float, v)) for v in self._ef(texts)]

    def embed_query(self, text: str) -> list[float]:
        return list(map(float, self._ef([text])[0]))


# Singleton embedding model instance
embedding_model = LightweightEmbeddings()
