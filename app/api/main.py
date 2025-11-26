from PIL import Image
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from database import DB, get_projects_list, get_proj_changes, save_proj_changes, save_survey_photo
from ifc import import_ifc_project

app = Flask(__name__)
cors = CORS(app)
DB().init_db()

ACCEPTED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp']
INVALID_FILE_RESPONSE = "Invalid file", 400


# TODO: max ifc and image file size
@app.route('/')
def index():
    # TODO: return api documentation
    return 'Index Page'


@app.get('/projects')
def get_projects():
    db = DB()
    projects, code = get_projects_list(db.cursor)
    db.connection.close()

    return jsonify(projects), code


@app.get('/project/<project_id>/changes')
def get_project_changes(project_id):
    db = DB()
    projects, code = get_proj_changes(db.cursor, project_id)
    db.connection.close()

    return jsonify(projects), code


@app.post('/project/<project_id>/changes')
def save_project_changes(project_id):
    db = DB()
    result, code = save_proj_changes(db.cursor, project_id, request.form)
    db.connection.commit()
    db.connection.close()

    return jsonify(result), code


@app.post('/upload_ifc')
def upload_ifc():
    if 'file' not in request.files:
        return "No file has been provided", 400

    file = request.files['file']

    if (
            file.filename == "" or
            not file.filename.rsplit('.', 1)[1].lower() == 'ifc'
    ):
        return INVALID_FILE_RESPONSE

    db = DB()
    result = import_ifc_project(db.cursor, file)
    db.connection.commit()
    db.connection.close()

    if result is None:
        return jsonify("Cannot process ifc file"), 500

    return jsonify(result), 201


@app.get('/get_xkt/<project_id>')
def get_xkt(project_id):
    if not project_id.endswith('.xkt'):
        return INVALID_FILE_RESPONSE

    return send_from_directory(
        "./uploads",
        project_id,
        as_attachment=True
    )


@app.get('/project/<project_id>/survey/<guid>/image/<image_id>')
def get_survey_image(project_id, guid, image_id):
    # https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
    if not any(image_id.endswith(ext) for ext in ACCEPTED_IMAGE_EXTENSIONS):
        return INVALID_FILE_RESPONSE

    return send_from_directory(
        f"./uploads/photos",
        f"{project_id}_{guid}_{image_id}",
        as_attachment=False
    )


@app.get('/project/<project_id>/survey/<guid>/image/<image_id>/small')
def get_survey_image_thumbnail(project_id, guid, image_id):
    if not any(image_id.endswith(ext) for ext in ACCEPTED_IMAGE_EXTENSIONS):
        return INVALID_FILE_RESPONSE

    return send_from_directory(
        f"./uploads/photos",
        f"small_{project_id}_{guid}_{image_id}",
        as_attachment=False
    )


@app.post('/project/<project_id>/survey/<guid>/image')
def post_survey_image(project_id, guid):
    if 'file' not in request.files:
        return "No file has been provided", 400

    file = request.files['file']

    # check filename
    if (
            file.filename == "" or
            not file.mimetype.startswith('image/') or
            not any(file.filename.rsplit('.', 1)[1].lower() == ext for ext in ACCEPTED_IMAGE_EXTENSIONS)
    ):
        return INVALID_FILE_RESPONSE

    # check file type
    try:
        img = Image.open(file.stream)
        img.verify()
        file.stream.seek(0)
        file_format = img.format.lower()

        if file_format not in ACCEPTED_IMAGE_EXTENSIONS:
            return INVALID_FILE_RESPONSE
    except Exception:
        return INVALID_FILE_RESPONSE

    db = DB()
    result, code = save_survey_photo(
        cursor=db.cursor,
        file=file,
        file_format=file_format,
        project_id=project_id,
        guid=guid
    )
    db.connection.commit()
    db.connection.close()

    if result is None:
        return jsonify("Cannot process ifc file"), 500

    return jsonify(result), code
