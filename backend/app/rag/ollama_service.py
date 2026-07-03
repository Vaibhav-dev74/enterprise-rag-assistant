from langchain_ollama import OllamaLLM

llm = OllamaLLM(
    model="qwen2.5:7b"
)

def generate_answer(question, context):

    prompt = f"""
You are an expert document question-answering assistant.

Strict Rules:
1. Answer ONLY using the provided context.
2. Never invent or assume information.
3. If the answer is not present, respond exactly:
   "Information not found in the document."
4. For skill-related questions:
   - Include only technical skills.
   - Include programming languages.
   - Include frameworks.
   - Include databases.
   - Include tools and technologies.
   - Exclude personal information.
5. Ignore:
   - Name
   - Email
   - Phone number
   - Address
   - Marks and percentages
   - College details unless specifically asked
6. Use bullet points whenever possible.
7. Keep answers concise and relevant.

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