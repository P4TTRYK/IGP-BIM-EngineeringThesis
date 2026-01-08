# BIM Scope

Wkleić wstęp

## Features

- Import IFC files
- Add survey information to model
- Add images of elements
- Measure elements lengths
- Measure angle between elements
- Cut model with section planes to see inside
- Show model location
- Show weather info of project location
- Export changed model to new IFC file
- Export images from model with specific name `project_guid`\_`element_guid`\_`timestamp`\.`photot_extension`

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
