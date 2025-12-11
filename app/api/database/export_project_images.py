import datetime as dt
import json
import os
import uuid
import zipfile

from .db import DB
from .get_project_changes import get_project_changes
from .get_projects_list import get_projects_list


def export_project_images(project_id):
    db = DB()
    projects_list, code = get_projects_list(db.cursor)
    if code != 200:
        return code

    # check if project exists
    project_info = None
    for project in projects_list:
        if project['id'] == int(project_id):
            project_info = project
            break

    if not project_info:
        return 404

    # get project changes
    project_changes, code = get_project_changes(db.cursor, project_id)
    db.connection.close()
    if code != 200:
        return code

    # get survey photos
    photos = []
    for change in project_changes:
        survey_photos = json.loads(change.get('photos', '[null]'))

        for photo in survey_photos:
            if photo is None:
                continue

            element_guid = change['guid']
            uuid7 = photo.split('.')[0]
            extension = photo.split('.')[-1]
            uuid7_time = uuid.UUID(uuid7).time

            photo_info = {
                'guid': element_guid,
                'photo_filename': f'{project_info['id']}_{element_guid}_{photo}',
                'out_filename': f'{project_info['guid']}_{element_guid}_{uuid7_time}.{extension}',
                'datetime': dt.datetime.fromtimestamp(uuid7_time / 1000.0)
            }

            photos.append(photo_info)

    if not len(photos):
        return 404

    # create zip with new filenames
    # https://docs.python.org/3.14/library/zipfile.html
    zip_file = f"./uploads/{project_id}_images.zip"
    if os.path.exists(zip_file):
        os.remove(zip_file)

    with zipfile.ZipFile(zip_file, 'w') as zipf:
        for photo in photos:
            photo_path = f"./uploads/photos/{photo['photo_filename']}"
            if os.path.exists(photo_path):
                zipf.write(photo_path, arcname=photo['out_filename'])

    return 200
