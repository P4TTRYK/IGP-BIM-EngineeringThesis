import sqlite3

def get_projects_list(cursor):
    try:
        cursor.execute("""
            SELECT id, guid, name, description, created_at, updated_at
            FROM projects
            ORDER BY updated_at DESC
        """)
        
        rows = cursor.fetchall()

        result = [dict(row) for row in rows]
        return result
    
    except sqlite3.Error as e:
        print(f"Błąd bazy danych: {e}")
        return []