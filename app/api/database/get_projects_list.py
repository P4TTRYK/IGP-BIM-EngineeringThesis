import sqlite3


def get_projects_list(cursor):
    try:
        cursor.execute("""
                       SELECT p.id,
                              p.guid,
                              p.name,
                              p.description,
                              p.created_at,
                              p.updated_at,
                              COUNT(DISTINCT s.id) AS changes, -- multiple photos per survey
                              COUNT(ph.id)         AS photos
                       FROM projects p
                                LEFT JOIN survey s ON s.project_id = p.id
                                LEFT JOIN photos ph ON ph.survey_id = s.id AND ph.deleted = 0
                       GROUP BY 1, 2, 3, 4, 5, 6
                       ORDER BY p.updated_at DESC""")

        rows = cursor.fetchall()

        result = [dict(row) for row in rows]

        return [result, 200]

    except sqlite3.Error as e:
        print(f"Błąd bazy danych: {e}")
        return [None, 500]
