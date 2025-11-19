import os
import uuid

from ifc import get_ifc_file_info
from ifc.convert_ifc2xkt import convert_ifc2xkt


def import_ifc_project(db_cursor, file):
    # prepare upload directory
    os.makedirs("./uploads", exist_ok=True)

    filename = f"{str(uuid.uuid4())}.ifc"
    file_path = os.path.join("./uploads", filename)
    file.save(file_path)

    # get ifc file info
    ifc_info = get_ifc_file_info(file_path)

    if ifc_info is None:
        return None

    project_guid = ifc_info["guid"]
    project_name = ifc_info["name"]
    project_description = ifc_info["description"]

    db_cursor.execute(
        """
        INSERT INTO projects (guid, name, description)
        VALUES (?, ?, ?)
        """,
        (
            project_guid,
            project_name,
            project_description,
        )
    )

    project_id = db_cursor.lastrowid

    # rename the file to match the project id
    new_file_path = os.path.join("./uploads", f"{project_id}.ifc")
    os.rename(file_path, new_file_path)

    # convert ifc to xkt
    xkt_file_path = os.path.join("./uploads", f"{project_id}.xkt")

    xkt_conversion = convert_ifc2xkt(new_file_path, xkt_file_path)

    if not xkt_conversion:
        return None

    # return new project info
    return {
        "id": project_id,
        "guid": project_guid,
        "name": project_name,
        "filename": filename
    }
