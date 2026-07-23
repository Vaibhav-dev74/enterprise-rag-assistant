from app.database.database import get_connection


def save_chat(
    session_id,
    question,
    answer,
    document,
):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO chat_history
        (
            session_id,
            question,
            answer,
            document
        )
        VALUES (?, ?, ?, ?)
        """,
        (
            session_id,
            question,
            answer,
            document,
        ),
    )

    conn.commit()

    conn.close()