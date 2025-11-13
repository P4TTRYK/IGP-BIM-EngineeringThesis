import sqlite3

class DB:
    def __init__(self):
        con = sqlite3.connect("Thesis.db")
        self.cur = con.cursor()

        with open('./schema.sql', 'r') as sql_file:
            sql_script = sql_file.read()
        self.cur.executescript(sql_script)
        con.commit()

