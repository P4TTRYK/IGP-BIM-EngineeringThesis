from flask import Flask, send_from_directory, jsonify
from database import DB, get_projects_list


app = Flask(__name__)
thesis_db = DB()

@app.route('/')
def index():
    return 'Index Page'

@app.route('/projects')
def get_projects():
    projects = get_projects_list(thesis_db.cursor)
    return jsonify(projects)


@app.route('/get_xkt/<p_guid>')
def get_xkt(p_guid):
    return send_from_directory(
        "./", p_guid, as_attachment=True
    )