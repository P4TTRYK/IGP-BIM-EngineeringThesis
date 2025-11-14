import sqlite3
from typing import List

def get_projects_list(cursor):
    try:
        cursor.execute("""
            SELECT id, guid, name, description, created_at, updated_at
            FROM projects
            ORDER BY updated_at DESC
        """)
        
        projects = [dict(row) for row in cursor.fetchall()]
        
        return projects
    
    except sqlite3.Error as e:
        print(f"Błąd bazy danych: {e}")
        return []