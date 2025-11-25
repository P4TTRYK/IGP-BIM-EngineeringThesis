import sqlite3


def get_proj_changes(cursor, project_id):
    try:
        cursor.execute("""
                       SELECT s.guid,
                              s.metadata,
                              json_group_array(p.filename) as photos,
                              s.updated_at
                       FROM survey s
                                LEFT JOIN photos p ON p.survey_id = s.id AND (p.deleted IS NULL OR p.deleted = 0)
                       WHERE s.project_id = ?
                       GROUP BY 1, 2, 4;
                       """, (project_id,))
        rows = cursor.fetchall()

        result = [dict(row) for row in rows]

        return [result, 200]

    except sqlite3.Error as e:
        print(f"Błąd bazy danych: {e}")
        return [None, 500]
