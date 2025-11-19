import os

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from database import DB, get_projects_list, create_project_from_ifc

app = Flask(__name__)
cors = CORS(app)
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


@app.route('/get_xkt/<p_guid>')
def get_xkt(p_guid):
    return send_from_directory(
        "./",
        p_guid,
        as_attachment=True
    )
