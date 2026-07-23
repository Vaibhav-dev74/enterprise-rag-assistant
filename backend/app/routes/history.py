from fastapi import APIRouter

from app.database.database import get_connection

router = APIRouter()


@router.get("/history/{session_id}")
def history(session_id: str):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            question,
            answer,
            document,
            timestamp
        FROM chat_history
        WHERE session_id=?
        ORDER BY id ASC
        """,
        (session_id,),
    )

    rows = cursor.fetchall()

    conn.close()

    history = []

    for row in rows:

        history.append(
            {
                "question": row[0],
                "answer": row[1],
                "document": row[2],
                "timestamp": row[3],
            }
        )

    return {
        "history": history
    }