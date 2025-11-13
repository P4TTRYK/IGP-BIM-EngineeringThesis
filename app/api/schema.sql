create table if not exists projects (
    id integer primary key autoincrement,
    name text not null,
    description text,
    created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp
);

create table if not exists survey (
    id integer primary key autoincrement,
    project_id integer not null,
    metadata text,
    photos text,
    updated_at datetime default current_timestamp,
    foreign key (project_id) references projects(id) on delete cascade
);

-- TODO: Autoupdate 'updated_at' on row update
-- TODO: Fix bug