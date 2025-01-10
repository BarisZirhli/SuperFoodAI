import psycopg2


def get_db_connection():
    try:
        connection = psycopg2.connect(
            dbname="SuperFoodDb",
            user="postgres",
            password="1234",
            host="localhost",
            port="5432",
        )
        cursor = connection.cursor()

        cursor.execute('SELECT * FROM "Ratings"')

        rows = cursor.fetchall()
        for row in rows:
            print(row)
        version = cursor.fetchone()
        print(f"PostgreSQL version: {version}")
        print("Successfully connected to the database!")
        return connection
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return None


get_db_connection()
