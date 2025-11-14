from flask import Flask, send_from_directory
from database import DB


app = Flask(__name__)

@app.route('/')
def index():
    to_db = DB()
    return 'Index Page'

@app.route('/get_xkt/<p_guid>')
def get_xkt(p_guid):
    return send_from_directory(
        "./", p_guid, as_attachment=True
    )

