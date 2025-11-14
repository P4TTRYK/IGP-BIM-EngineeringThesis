import sqlite3

class DB:
    def __init__(self):
        con = sqlite3.connect("Thesis.db")
        self.cursor = con.cursor()

        with open('./schema.sql', 'r') as sql_file:
            sql_script = sql_file.read()
        self.cursor.executescript(sql_script)
        con.commit()
        print("Database initialized")

