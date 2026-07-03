from app.database.database import get_connection


def save_chat(question, answer, document):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO chat_history
        (question, answer, document)
        VALUES (?, ?, ?)
        """,
        (question, answer, document)
    )

    conn.commit()

    conn.close()


def get_chat_history():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
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
            "question": row[1],
            "answer": row[2],
            "document": row[3],
            "timestamp": row[4]
        })

    return history