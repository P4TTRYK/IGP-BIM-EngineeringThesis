import sqlite3


def get_proj_changes(cursor, project_id):
    try:
        cursor.execute("""
                       SELECT guid, metadata, photos, updated_at
                       FROM survey
                       WHERE project_id = ?
                       """, (project_id,))
        rows = cursor.fetchall()

        result = [dict(row) for row in rows]

        return [result, 200]

    except sqlite3.Error as e:
        print(f"Błąd bazy danych: {e}")
        return [None, 500]
