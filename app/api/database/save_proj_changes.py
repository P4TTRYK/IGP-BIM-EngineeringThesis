import sqlite3

from database import get_projects_list


def save_proj_changes(cursor, project_id, changes):
    try:
        guid = changes['guid']  # text
        metadata = changes['metadata']  # json as text

        if not project_id.isdigit():
            return [None, 400]

        if not guid:
            return [None, 400]

        if not metadata:
            metadata = '{}'

        # check if project exists
        projects = get_projects_list(cursor)

        project_exists = any(proj['id'] == int(project_id) for proj in projects[0])

        if not project_exists:
            return [None, 400]

        # insert on error update
        cursor.execute("""
                       INSERT INTO survey (project_id, guid, metadata)
                       VALUES (?, ?, ?)
                       ON CONFLICT(project_id, guid) DO UPDATE SET metadata=excluded.metadata
                       """, (project_id, guid, metadata))

        return ['ok', 201]

    except sqlite3.Error as e:
        print(f"Błąd bazy danych: {e}")
        return [None, 500]
