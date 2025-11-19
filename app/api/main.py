from flask import Flask, jsonify, send_from_directory, request
import os

from database import DB, get_projects_list
from database.new_ifc import create_project_from_ifc

app = Flask(__name__)
thesis_db = DB()

UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route('/')
def index():
    return 'Index Page'

@app.route('/projects')
def get_projects():
    projects = get_projects_list(thesis_db.cursor)
    return jsonify(projects)

@app.route('/upload_ifc', methods=['POST'])
def upload_ifc():
    if 'file' not in request.files:
        return jsonify({"error": "Brak pliku IFC"}), 400

    file = request.files['file']
    filename = file.filename
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    result = create_project_from_ifc(thesis_db.cursor, file_path, filename)

    if result is None:
        return jsonify({"error": "Nie udało się przetworzyć IFC"}), 500

    return jsonify(result), 201
