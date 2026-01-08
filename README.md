# BIM Scope

Wkleić wstęp

## Features

skriny

## Used stack

- Backend: Python, Flask, uv
- Frontend: React, xeokit-sdk

## External services

> [!Note]
> [openweathermap](https://openweathermap.org/) - api key required to show location weather info, add your own key in
`/app/api/database/get_project_weather.py`

## Prerequisites

- uv
- nodejs

## Usage

### clone `git clone` or download .zip

### Start backend api server

- go to /app/api
- install pyproject
- `uv sync`
- `uv run python -m flask --app main run`

### Start

- go to /app/xeokit
- `npm install`
- `npm run dev`
- enjoy
