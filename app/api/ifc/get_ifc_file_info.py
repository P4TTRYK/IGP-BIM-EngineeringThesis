def get_ifc_file_info(model):
    try:
        project = model.by_type("IfcProject")[0]

        return {
            "name": project.Name if project.Name is not None else "brak nazwy",
            "description": project.Description if project.Description is not None else "brak opisu",
            "guid": project.GlobalId
        }

    except Exception as e:
        print("Błąd IFC:", e)
        return None
