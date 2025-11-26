import os
import uuid

from database import get_projects_list


def save_survey_photo(cursor, file, file_format, project_id, guid):
    os.makedirs("./uploads/photos", exist_ok=True)

    # check if project exists
    projects = get_projects_list(cursor)
    project_exists = any(proj['id'] == int(project_id) for proj in projects[0])
    if not project_exists:
        return ["Invalid project", 400]

    filename = f"{str(uuid.uuid7())}.{file_format}"

    file_path = os.path.join("./uploads/photos", f"{project_id}_{guid}_{filename}")
    file.save(file_path)

    # insert empty survey if not exists
    cursor.execute("""
                   INSERT INTO survey (project_id, guid, metadata)
                   VALUES (?, ?, ?)
                   ON CONFLICT DO NOTHING
                   """, (project_id, guid, "{}"))

    # get survey_id
    cursor.execute("""
                   SELECT id
                   FROM survey
                   WHERE project_id = ?
                     AND guid = ?
                   """, (project_id, guid))
    survey = cursor.fetchone()
    survey_id = survey[0]

    if survey_id is None:
        return ["Survey not found", 400]

    # insert photo record
    cursor.execute("""
                   INSERT INTO photos (survey_id, filename)
                   VALUES (?, ?)
                   """, (survey_id, filename))

    if cursor.rowcount == 0:
        return ["Failed to save photo", 500]

    return [filename, 201]
