import sqlite3

DATABASE = "chat_history.db"


def get_connection():
    return sqlite3.connect(DATABASE)


def create_tables():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_history (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        question TEXT NOT NULL,

        answer TEXT NOT NULL,

        document TEXT NOT NULL,

        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()

    conn.close()