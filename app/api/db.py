import sqlite3

class DB:
    def __init__(self):
        con = sqlite3.connect("Thesis.db")
        self.cur = con.cursor()