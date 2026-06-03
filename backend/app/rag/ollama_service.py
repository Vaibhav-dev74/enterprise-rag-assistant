from langchain_ollama import OllamaLLM

llm = OllamaLLM(
    model="tinyllama"
)

def generate_answer(question, context):

    prompt = f"""
You are a helpful AI assistant.

Use ONLY the context below to answer.

Context:
{context}

Question:
{question}

Answer:
"""

    print("\n========== PROMPT ==========")
    print(prompt[:3000])

    response = llm.invoke(prompt)

    return response