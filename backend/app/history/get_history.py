from app.database.database import get_connection


def get_history(
    session_id,
    limit=5,
):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            question,
            answer
        FROM chat_history
        WHERE session_id=?
        ORDER BY id DESC
        LIMIT ?
        """,
        (
            session_id,
            limit,
        ),
    )

    rows = cursor.fetchall()

    conn.close()

    rows.reverse()

    history = ""

    for question, answer in rows:

        history += f"User: {question}\n"

        history += f"Assistant: {answer}\n\n"

    return history