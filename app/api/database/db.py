import sqlite3


class DB:
    def __init__(self):
        self.connection = sqlite3.connect("Thesis.db", check_same_thread=False)
        self.connection.row_factory = sqlite3.Row
        self.cursor = self.connection.cursor()

    def __del__(self):
        self.cursor.close()
        self.connection.close()

    def init_db(self):
        with open('./schema.sql', 'r') as sql_file:
            sql_script = sql_file.read()

        self.cursor.executescript(sql_script)
        self.connection.commit()

        self.connection.close()
