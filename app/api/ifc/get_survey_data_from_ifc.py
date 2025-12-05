import json

import ifcopenshell
import ifcopenshell.util.element

PSET_NAME = "BScope_ElementSurvey"


def get_survey_data_from_ifc(model):
    changes = {}
    for element in model.by_type('IfcElement'):
        psets = ifcopenshell.util.element.get_psets(element)

        if PSET_NAME in psets:
            guid = element.GlobalId
            pset_values = psets[PSET_NAME]

            if 'id' in pset_values:
                del pset_values['id']

            changes[guid] = json.dumps(pset_values)

    return changes
