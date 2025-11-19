from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from database import DB, get_projects_list
from ifc import import_ifc_project

app = Flask(__name__)
cors = CORS(app)
DB().init_db()


@app.route('/')
def index():
    # TODO: return api documentation
    return 'Index Page'


@app.route('/projects')
def get_projects():
    db = DB()
    projects, code = get_projects_list(db.cursor)
    db.connection.close()

    return jsonify(projects), code


@app.route('/upload_ifc', methods=['POST'])
def upload_ifc():
    if 'file' not in request.files:
        return "No file has been provided", 400

    file = request.files['file']

    if not file.filename.rsplit('.', 1)[1].lower() == 'ifc':
        return "Wrong file extension", 422

    if file.filename == "":
        return "Wrong filename", 422

    db = DB()
    result = import_ifc_project(db.cursor, file)
    db.connection.commit()
    db.connection.close()

    if result is None:
        return jsonify("Cannot process ifc file"), 500

    return jsonify(result), 201


@app.route('/get_xkt/<p_guid>')
def get_xkt(p_guid):
    # TODO: get files after checking in database, xkt only and from proper directory
    return send_from_directory(
        "./",
        p_guid,
        as_attachment=True
    )
