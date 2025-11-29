import json
import os

import ifcopenshell
import ifcopenshell.api.pset
import ifcopenshell.util.element

# If you create your own, you must not use 'Pset_' prefix
PSET_NAME = "BScope_ElementSurvey"


# https://docs.ifcopenshell.org/ifcopenshell-python/code_examples.html
# https://docs.ifcopenshell.org/autoapi/ifcopenshell/api/pset/index.html
def export_ifc_changes(changes, ifc_file, output_file):
    if not os.path.exists(ifc_file):
        return 404

    if os.path.exists(output_file):
        os.remove(output_file)

    model = ifcopenshell.open(ifc_file)

    for change in changes:
        guid = change.get('guid', None)
        metadata = change.get('metadata', '')
        # photos = change.get('photos', '') # save separately
        update_time = change.get('update_time', None)

        print(guid, metadata, update_time)

        if guid is None:
            continue

        element = model.by_guid(guid)
        if element is None:
            continue

        try:
            metadata_dict = json.loads(metadata)
        except Exception as e:
            metadata_dict = {}

        pset = ifcopenshell.api.pset.add_pset(file=model, product=element, name=PSET_NAME)
        ifcopenshell.api.pset.edit_pset(file=model, pset=pset, properties=metadata_dict)

    model.write(output_file)

    return 200
