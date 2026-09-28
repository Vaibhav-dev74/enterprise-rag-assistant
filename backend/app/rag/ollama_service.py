import os

def get_llm():
    """
    Returns the appropriate LLM instance based on environment configuration:
    - If GROQ_API_KEY is present or LLM_PROVIDER=groq: Uses high-performance Groq Cloud
    - If GEMINI_API_KEY is present or LLM_PROVIDER=gemini: Uses Google Gemini Cloud
    - Otherwise: Falls back to local Ollama instance (defaulting to qwen2.5:7b)
    """
    provider = os.getenv("LLM_PROVIDER", "").lower().strip()
    groq_api_key = os.getenv("GROQ_API_KEY")
    gemini_api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

    if provider == "groq" or (not provider and groq_api_key):
        from langchain_groq import ChatGroq
        model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        temperature = float(os.getenv("LLM_TEMPERATURE", "0.2"))
        return ChatGroq(
            groq_api_key=groq_api_key,
            model_name=model,
            temperature=temperature,
        )

    if provider == "gemini" or (not provider and gemini_api_key):
        from langchain_google_genai import ChatGoogleGenerativeAI
        model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        temperature = float(os.getenv("LLM_TEMPERATURE", "0.2"))
        return ChatGoogleGenerativeAI(
            google_api_key=gemini_api_key,
            model=model,
            temperature=temperature,
        )

    # Default fallback: Local Ollama
    from langchain_ollama import OllamaLLM
    base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    model = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")
    return OllamaLLM(
        base_url=base_url,
        model=model,
    )


def generate_answer(question: str, context: str, history: list = None):
    """
    Generates a full answer string from document context and history.
    """
    answer = ""
    for chunk in stream_answer(question, context, history):
        answer += chunk
    return answer


def stream_answer(question: str, context: str, history: list = None):
    """
    Streams answer chunks from the active LLM.
    """
    history_str = ""
    if history:
        for item in history:
            q = item.get("question", "")
            a = item.get("answer", "")
            history_str += f"User: {q}\nAssistant: {a}\n\n"

    prompt = f"""You are an expert Enterprise RAG Assistant.

Rules:
1. Answer the question using ONLY the provided document context.
2. If the answer is not present in the document, respond with: "Information not found in the document."
3. Do not speculate or invent information.
4. Use clear formatting and bullet points where helpful.
5. Use conversation history only to understand follow-up questions.

Conversation History:
{history_str or "No previous conversation."}

Document Context:
{context}

Question:
{question}

Answer:"""

    try:
        llm = get_llm()
        for chunk in llm.stream(prompt):
            if hasattr(chunk, "content"):
                yield chunk.content
            else:
                yield str(chunk)
    except Exception as e:
        err_msg = str(e)
        if "Connection refused" in err_msg or "Failed to connect" in err_msg or "11434" in err_msg:
            yield (
                "Unable to connect to the local Ollama instance. "
                "If hosting in the cloud, please configure GROQ_API_KEY in your environment variables. "
                "If running locally, please ensure Ollama is running (`ollama serve`)."
            )
        else:
            raise e