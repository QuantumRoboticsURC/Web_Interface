import sqlite3
import os
from flask import Flask, Response, render_template, jsonify, g, request, redirect, url_for


#Initialize
DATABASE = 'rocks.db'

# Helper function to get the SQLite database connection
def get_rock_db():
    conn = sqlite3.connect(DATABASE)
    return conn

def init_rock_db():
    try:
        conn = get_rock_db()
        with open('db/rock_schema.sql', mode='r') as f:
            # Read and execute the SQL commands from the schema.sql file
            print("********************Executing SQL from schema.sql********************")
            conn.cursor().executescript(f.read())
        conn.commit()
        conn.close()
        print("Database initialized successfully.")
    except FileNotFoundError:
        print("Error: schema.sql not found. Please make sure the schema file is in the correct location.")
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


#Gets
def get_rocks():
    conn = get_rock_db()
    c= conn.cursor()
    c.execute('''
    SELECT r.rock_id, r.name, r.type, r.texture, c.color_name, m.mineral_name, r.image_path 
    FROM rocks r
    JOIN rock_colors rc ON r.rock_id = rc.rock_id
    JOIN colors c ON rc.color_id = c.color_id
    JOIN rock_minerals rm ON r.rock_id = rm.rock_id
    JOIN minerals m ON rm.mineral_id = m.mineral_id
    ''')
    rocks = c.fetchall()
    conn.close()
    return rocks

def get_rock_types():
    conn = get_rock_db()
    c = conn.cursor()
    c.execute('SELECT DISTINCT type FROM rocks')
    rock_types = c.fetchall()
    conn.close()
    return [rock_type[0] for rock_type in rock_types]

def get_rock_textures():
    conn = sqlite3.connect(DATABASE) 
    c = conn.cursor()
    c.execute("SELECT DISTINCT texture FROM rocks")
    textures = [row[0] for row in c.fetchall()]
    conn.close()
    return textures

def get_rock_colors():
    conn = sqlite3.connect(DATABASE) 
    c = conn.cursor()
    c.execute("SELECT DISTINCT color_name FROM colors")
    colors = [row[0] for row in c.fetchall()]
    conn.close()
    return colors

def get_rocks_minerals():
    conn = sqlite3.connect(DATABASE) 
    c = conn.cursor()
    c.execute("SELECT DISTINCT mineral_name FROM minerals")
    minerals = [row[0] for row in c.fetchall()]
    conn.close()
    return minerals



#Insert
def insert_rock(name, rock_type, texture, colors, minerals, image_path):
    conn = sqlite3.connect('rocks.db')
    c = conn.cursor()
    texture = texture.lower()

    # Insertar la roca
    c.execute("""
        INSERT INTO rocks (name, type, texture, image_path) 
        VALUES (?, ?, ?, ?)
    """, (name, rock_type, texture, image_path))
    rock_id = c.lastrowid

    # Colores
    color_list = [color.strip().lower() for color in colors.split(",")]
    for color in color_list:
        c.execute("""
            INSERT OR IGNORE INTO colors (color_name) 
            VALUES (?)
        """, (color,))
        c.execute("""
            INSERT INTO rock_colors (rock_id, color_id) 
            SELECT ?, color_id FROM colors WHERE color_name = ?
        """, (rock_id, color))

    
    # Process minerals
    mineral_list = [mineral.strip().lower() for mineral in minerals.split(",")]
    for mineral in mineral_list:
        c.execute("""
            INSERT OR IGNORE INTO minerals (mineral_name) 
            VALUES (?)
        """, (mineral,))
        c.execute("""
            INSERT INTO rock_minerals (rock_id, mineral_id) 
            SELECT ?, mineral_id FROM minerals WHERE mineral_name = ?
        """, (rock_id, mineral))

    conn.commit()
    conn.close()
    print("Se introdujo la roca con exito!")

#Creation
def create_rock():
    
    #Manipulate Form
    name = request.form['name']
    rock_type = request.form['type']
    texture = request.form['texture']
    colors = request.form['colors']
    minerals = request.form['minerals']
    image = request.files['image']


    filename = image.filename
    image_path = os.path.join('static/img/rocas', filename)
    image.save(image_path)

    # Insert the data into the SQLite database
    insert_rock(name, rock_type, texture, colors, minerals, image_path)
    return redirect(url_for('rocks'))


#Filtering
def get_filtered_rocks(filters):

    conn = sqlite3.connect(DATABASE) 
    c = conn.cursor()

    # SQL query
    query = """
        SELECT 
        r.rock_id,
        r.name,
        r.type,
        r.texture,
        r.image_path,
        GROUP_CONCAT(DISTINCT c.color_name) AS colors,
        GROUP_CONCAT(DISTINCT m.mineral_name) AS minerals
        FROM rocks r
        LEFT JOIN rock_colors rc ON r.rock_id = rc.rock_id
        LEFT JOIN colors c ON rc.color_id = c.color_id
        LEFT JOIN rock_minerals rm ON r.rock_id = rm.rock_id
        LEFT JOIN minerals m ON rm.mineral_id = m.mineral_id
    """
    
    # Build WHERE
    conditions = []
    params = []

    # Type
    if filters.get("type") and filters["type"] != "all":
        conditions.append("r.type = ?")
        params.append(filters["type"])

    # Texture
    if filters.get("texture") and filters["texture"] != "all":
        conditions.append("r.texture = ?")
        params.append(filters["texture"])

    # Color
    if filters.get("color") and filters["color"] != "all":
        conditions.append("c.color_name = ?")
        params.append(filters["color"])

    # Mineral
    if filters.get("mineral") and filters["mineral"] != "all":
        conditions.append("m.mineral_name = ?")
        params.append(filters["mineral"])

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    query += " GROUP BY r.rock_id"

    try:
        c.execute(query, params)
        rocks = c.fetchall()
        conn.close()
        return rocks

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        conn.close()
        return []

def gather_rocks():

    rock_types = get_rock_types()
    textures = get_rock_textures()
    colors = get_rock_colors()
    minerals = get_rocks_minerals()

    categories = {
        'types': rock_types,
        'textures': textures,
        'colors': colors,
        'minerals': minerals
    } 

    filters = {
        "type": request.args.get("type", "all"),
        "texture": request.args.get("texture", "all"),
        "color": request.args.get("color", "all"),
        "mineral": request.args.get("mineral", "all"),
    }

    rocks = get_filtered_rocks(filters)

    return rocks, categories

def delete_rock():

    params = request.args.get("del_rock")
    print(f'****************************************', {params}, '******************************')
    conn = get_rock_db()
    c = conn.cursor()
 
    c.execute('''
        DELETE FROM rocks 
        WHERE rock_id = ?''', 
        (params,))
    
    conn.commit()
    conn.close()

    return redirect(url_for('rocks'))




# Function to print the table from the database
def print_table():
    # Connect to the SQLite database
    conn = sqlite3.connect('rocks.db')  # Replace with your database name
    cursor = conn.cursor()

    # Execute a SELECT query to fetch all rows from the table
    cursor.execute("SELECT * FROM rocks")  # Replace 'rocks' with your table name

    # Fetch all rows from the result of the query
    rows = cursor.fetchall()

    # Check if there are any rows
    if rows:
        # Print the column names
        column_names = [description[0] for description in cursor.description]
        print(" | ".join(column_names))

        # Print each row of the result
        for row in rows:
            print(" | ".join(str(value) for value in row))
    else:
        print("No data found.")

    # Close the database connection
    conn.close()

# Call the function to print the table
print_table()
