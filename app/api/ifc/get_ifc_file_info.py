def get_ifc_file_info(model):
    try:
        project = model.by_type("IfcProject")[0]

        return {
            "name": project.Name,
            "description": project.Description,
            "guid": project.GlobalId
        }

    except Exception as e:
        print("Błąd IFC:", e)
        return None
