# BIM Scope

This project is part of an engineering thesis. It is designed as a model browser based on open standards for managing and analyzing BIM (Building Information Modeling) data for construction projects. The platform enables visualize and document IFC model, changes, and survey data.

The backend is built with Python (Flask) and uses SQLite for data storage. The frontend leverages React, Vite, and xeokit-sdk for fast and interactive BIM visualization. The system also utilizes OpenAPI for documentation and standardizes data exchange using IFC/XKT formats. All IFC files are converted to XKT format for more efficient visualization in model browser.  Weather data integration requires an API key for OpenWeatherMap, which should be configured in `/app/api/database/get_project_weather.py`.

## Features

- Import and visualization of IFC files 
- Add survey information to model elements
- Add images of elements
- Measure elements lengths
- Measure angle between elements
- Cut model with section planes to see inside
- Show model location
- Show weather info of project location
- Export changed model to new IFC file
- Export images from model with specific name `project_guid`\_`element_guid`\_`timestamp`\.`photot_extension`
- Storing and managing project data, changes, and images in a SQLite database

<img src="screenshots/screen_main.jpg" alt="drawing" width="400"/>
<img src="screenshots/screen_cut_plane.jpg" alt="drawing" width="400"/>
<img src="screenshots/screen_measure.jpg" alt="drawing" width="400"/>

## Used stack

- Backend: Python, Flask, uv
- Frontend: Node, React, xeokit-sdk

## External services

> [!Note]
> [openweathermap](https://openweathermap.org/) - api key required to show location weather info, add your own key in
`/app/api/database/get_project_weather.py`

## Prerequisites

- uv
- node

## Usage

clone by `git clone` or download repo as .zip

### Start backend api server

- go to /app/api
- run `uv sync` to install dependencies
- run `uv run python -m flask --app main run` to start api server

### Start frontend

- go to /app/xeokit
- run `npm install` to install dependencies
- run `npm run dev` to start frontend server

enjoy! 🎉

## Known issues

On some devices generating thumbnails may fail, so no thumbnail sorry :(
