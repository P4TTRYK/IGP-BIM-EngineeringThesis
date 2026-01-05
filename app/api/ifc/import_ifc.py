import os
import uuid

import ifcopenshell

from database import save_project_changes
from .convert_ifc2xkt import convert_ifc2xkt
from .generate_thumbnail import generate_thumbnail
from .get_ifc_file_info import get_ifc_file_info
from .get_project_location import get_project_location
from .get_survey_data_from_ifc import get_survey_data_from_ifc


def import_ifc_project(db_cursor, file):
    # prepare upload directory
    os.makedirs("./uploads", exist_ok=True)

    filename = f"{str(uuid.uuid4())}.ifc"
    file_path = os.path.join("./uploads", filename)
    file.save(file_path)

    model = ifcopenshell.open(file_path)

    # get ifc file info
    ifc_info = get_ifc_file_info(model)

    if ifc_info is None:
        return None

    project_guid = ifc_info["guid"]
    project_name = ifc_info["name"]
    project_description = ifc_info["description"]
    project_location = get_project_location(model)

    db_cursor.execute(
        """
        INSERT INTO projects (guid, name, description, location)
        VALUES (?, ?, ?, ?)
        """,
        (
            project_guid,
            project_name,
            project_description,
            project_location,
        )
    )

    project_id = db_cursor.lastrowid

    # add existing survey data
    changes = get_survey_data_from_ifc(model)

    for change in changes:
        save_project_changes(
            cursor=db_cursor,
            project_id=str(project_id),
            changes={
                "guid": change,
                "metadata": changes[change]
            }
        )

    # rename the file to match the project id
    new_file_path = os.path.join("./uploads", f"{project_id}.ifc")
    os.rename(file_path, new_file_path)

    # convert ifc to xkt
    xkt_file_path = os.path.join("./uploads", f"{project_id}.xkt")

    xkt_conversion = convert_ifc2xkt(new_file_path, xkt_file_path)

    if not xkt_conversion:
        return None

    # create model thumbnail
    #thumbnail_path = os.path.join("./uploads", f"{project_id}.png")
    #generate_thumbnail(new_file_path, thumbnail_path)

    # return new project info
    return {
        "id": project_id,
        "guid": project_guid,
        "name": project_name,
        "filename": filename
    }
