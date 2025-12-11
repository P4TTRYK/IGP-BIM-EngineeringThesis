import os

from PIL import Image
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

import database
from ifc import import_ifc_project, export_ifc_changes

app = Flask(__name__)
cors = CORS(app)
database.DB().init_db()

ACCEPTED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp']
INVALID_FILE_RESPONSE = "Invalid file", 400


# TODO: max ifc and image file size
@app.route('/')
def index():
    # TODO: return api documentation
    return 'Index Page'


@app.get('/projects')
def get_projects():
    db = database.DB()
    projects, code = database.get_projects_list(db.cursor)
    db.connection.close()

    return jsonify(projects), code


@app.get('/project/<int:project_id>/image')
def get_project_image(project_id):
    return send_from_directory(
        f"./uploads",
        f"{str(project_id)}.png",
        as_attachment=False
    )


@app.get('/project/<int:project_id>/export')
def get_changed_project(project_id):
    project_id = str(project_id)

    db = database.DB()
    changes, code = database.get_project_changes(db.cursor, project_id)
    db.connection.close()

    if code != 200:
        return jsonify("Error"), code

    input_ifc = f"./uploads/{project_id}.ifc"
    if not os.path.exists(input_ifc):
        return jsonify("Error"), 404

    output_ifc = f"./uploads/{project_id}_changed.ifc"

    code = export_ifc_changes(changes, input_ifc, output_ifc)

    if code != 200:
        return jsonify("Error"), code

    return send_from_directory(
        f"./uploads",
        f"{project_id}_changed.ifc",
        as_attachment=False
    )


@app.get('/project/<int:project_id>/export_photos')
def get_changed_project_photos(project_id):
    project_id = str(project_id)

    code = database.export_project_images(project_id)

    if code != 200:
        return jsonify("Error"), code

    return send_from_directory(
        f"./uploads",
        f"{project_id}_images.zip",
        as_attachment=False
    )


@app.get('/project/<int:project_id>/changes')
def get_project_changes_route(project_id):
    db = database.DB()
    changes, code = database.get_project_changes(db.cursor, str(project_id))
    db.connection.close()

    return jsonify(changes), code


@app.post('/project/<int:project_id>/changes')
def save_project_changes_route(project_id):
    db = database.DB()
    result, code = database.save_project_changes(db.cursor, str(project_id), request.form)
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

    db = database.DB()
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


@app.get('/project/<int:project_id>/survey/<guid>/image/<image_id>')
def get_survey_image(project_id, guid, image_id):
    # https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
    if not any(image_id.endswith(ext) for ext in ACCEPTED_IMAGE_EXTENSIONS):
        return INVALID_FILE_RESPONSE

    return send_from_directory(
        f"./uploads/photos",
        f"{str(project_id)}_{guid}_{image_id}",
        as_attachment=False
    )


@app.get('/project/<int:project_id>/survey/<guid>/image/<image_id>/small')
def get_survey_image_thumbnail(project_id, guid, image_id):
    if not any(image_id.endswith(ext) for ext in ACCEPTED_IMAGE_EXTENSIONS):
        return INVALID_FILE_RESPONSE

    return send_from_directory(
        f"./uploads/photos",
        f"small_{str(project_id)}_{guid}_{image_id}",
        as_attachment=False
    )


@app.post('/project/<int:project_id>/survey/<guid>/image')
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

    db = database.DB()
    result, code = database.save_survey_photo(
        cursor=db.cursor,
        file=file,
        file_format=file_format,
        project_id=str(project_id),
        guid=guid
    )
    db.connection.commit()
    db.connection.close()

    if result is None:
        return jsonify("Cannot process ifc file"), 500

    return jsonify(result), code


@app.get('/project/<int:project_id>/weather')
def get_project_weather(project_id):
    db = database.DB()
    result, code = database.get_project_weather(cursor=db.cursor, project_id=project_id)
    db.connection.close()

    return jsonify(result), code
