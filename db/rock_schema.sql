CREATE TABLE IF NOT EXISTS rocks(
    rock_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    texture TEXT NOT NULL,
    image_path TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS colors(
    color_id INTEGER PRIMARY KEY AUTOINCREMENT,
    color_name TEXT NOT NULL UNIQUE
);



CREATE TABLE IF NOT EXISTS rock_colors(
    rock_id INTEGER NOT NULL,
    color_id INTEGER NOT NULL,
    PRIMARY KEY (rock_id, color_id),
    FOREIGN KEY (rock_id) REFERENCES rocks(rock_id) ON DELETE CASCADE,
    FOREIGN KEY (color_id) REFERENCES colors(color_id) ON DELETE CASCADE
    
);


CREATE TABLE IF NOT EXISTS minerals(
    mineral_id INTEGER PRIMARY KEY AUTOINCREMENT,
    mineral_name TEXT NOT NULL UNIQUE
    );


CREATE TABLE IF NOT EXISTS rock_minerals(
    rock_id INTEGER NOT NULL,
    mineral_id INTEGER NOT NULL,
    PRIMARY KEY (rock_id, mineral_id),
    FOREIGN KEY (rock_id) REFERENCES rocks(rock_id) ON DELETE CASCADE,
    FOREIGN KEY (mineral_id) REFERENCES minerals(mineral_id) ON DELETE CASCADE
    );



