import json

import requests

from .get_projects_list import get_projects_list

# REPLACE WITH YOUR OWN OPENWEATHER API KEY
OPENWEATHER_API_KEY = ''


def get_project_weather(cursor, project_id):
    projects, code = get_projects_list(cursor)

    project_location = None
    for project in projects:
        if project['id'] == int(project_id):
            project_location = project.get('location', None)
            break

    if not project_location:
        return None, 404

    project_location = json.loads(project_location)

    if (len(project_location) != 2 or
            project_location[0] == 0 or
            project_location[1] == 0 or
            not isinstance(project_location[0], (int, float)) or
            not isinstance(project_location[1], (int, float))):
        return None, 404

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        'lon': project_location[0],
        'lat': project_location[1],
        'appid': OPENWEATHER_API_KEY,
        'units': 'metric',
        'lang': 'pl',
    }

    try:
        response = requests.get(url, params=params, headers={'User-Agent': 'BScopeApp/1.0'})
        response.raise_for_status()
        data = response.json()

        return data, 200
    except requests.RequestException as e:
        print(f"Weather request failed: {e}")

    return None, 404
