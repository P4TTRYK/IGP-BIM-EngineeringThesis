import uuid
import ifcopenshell
from datetime import datetime



def read_ifc_info(file_path):
    try:
        ifc = ifcopenshell.open(file_path)

        project = ifc.by_type("IfcProject")[0]

        project_name = project.Name if project.Name else "Nieznana nazwa"
        project_guid = project.GlobalId if project.GlobalId else str(uuid.uuid4())

        return {
            "ifc_project_name": project_name,
            "ifc_project_guid": project_guid
        }

    except Exception as e:
        print("Błąd IFC:", e)
        return None

def create_project_from_ifc(cursor, file_path, filename):
    data = read_ifc_info(file_path)

    if data is None:
        return None


    project_guid = data["ifc_project_guid"]

    cursor.execute("""
        INSERT INTO projects (guid, name, description, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
    """, (
        project_guid,
        data["ifc_project_name"],
        f"Projekt utworzony z pliku IFC: {filename}",
        datetime.now(),
        datetime.now()
    ))

    project_id = cursor.lastrowid

    return {
        "id": project_id,
        "guid": project_guid,
        "name": data["ifc_project_name"],
        "filename": filename
    }