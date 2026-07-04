from app.database.database import get_connection


def save_chat(session_id, question, answer, document):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO chat_history
        (session_id, question, answer, document)
        VALUES (?, ?, ?, ?)
    """, (
        session_id,
        question,
        answer,
        document
    ))

    conn.commit()
    conn.close()


def get_chat_history():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            session_id,
            question,
            answer,
            document,
            timestamp
        FROM chat_history
        ORDER BY timestamp DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    history = []

    for row in rows:
        history.append({
            "id": row[0],
            "session_id": row[1],
            "question": row[2],
            "answer": row[3],
            "document": row[4],
            "timestamp": row[5]
        })

    return history