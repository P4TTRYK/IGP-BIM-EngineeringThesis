create table if not exists projects
(
    id          integer primary key autoincrement,
    guid        text not null,
    name        text not null,
    description text,
    created_at  datetime default current_timestamp,
    updated_at  datetime default current_timestamp
);

create table if not exists survey
(
    id         integer primary key autoincrement,
    guid       text    not null,
    project_id integer not null,
    metadata   text,
    photos     text,
    updated_at datetime default current_timestamp,
    unique (guid, project_id),
    foreign key (project_id) references projects (id) on delete cascade
);

create trigger if not exists update_project_updated_at
    after update
    on projects
begin
    update projects set updated_at = current_timestamp where id = old.id;
end;

create trigger if not exists update_survey_updated_at
    after update
    on survey
begin
    update survey set updated_at = current_timestamp where id = old.id;
    update projects set updated_at = current_timestamp where id = old.project_id;
end;

create table if not exists photos
(
    id          integer primary key autoincrement,
    guid        text    not null unique,
    survey_id   integer not null,
    project_id  integer not null,
    filename    text    not null,
    filepath    text    not null,
    file_size   integer,
    mime_type   text,
    description text,
    created_at  datetime default current_timestamp,
    updated_at  datetime default current_timestamp,
    foreign key (survey_id) references survey (id) on delete cascade,
    foreign key (project_id) references projects (id) on delete cascade
);

create trigger if not exists update_photos_updated_at
    after update
    on photos
begin
    update photos set updated_at = current_timestamp where id = new.id;
    update projects set updated_at = current_timestamp where id = new.project_id;
end;
