create TABLE users(
    "UserID" SERIAL PRIMARY KEY,
    "username" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "avatar" VARCHAR(255) 

);
create TABLE rootusers(
    "RootUserID" SERIAL PRIMARY KEY,
    "username" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL
);

CREATE TABLE projects (
    "ProjectID" SERIAL PRIMARY KEY,
    "NameProject" VARCHAR(255) NOT NULL UNIQUE,
    "DescriptionProject" VARCHAR(100000),
    "LinkFigma" VARCHAR(100000),
    "LinkGit" VARCHAR(100000),
    "PhotoProject" VARCHAR(100000),
    "Status" VARCHAR(255) DEFAULT 'В разработке',
    "Visibility" VARCHAR(255) DEFAULT 'Приватный',
    "CreatorUserID" INTEGER REFERENCES "users" ("UserID") NOT NULL
);

CREATE TABLE projectmembers (
    "MemberID" SERIAL PRIMARY KEY ,
    "ProjectID" INTEGER REFERENCES "projects" ("ProjectID") ON DELETE CASCADE NOT NULL,
    "UserID" INTEGER REFERENCES "users" ("UserID") ON DELETE CASCADE NOT NULL,
    "Role" VARCHAR(255) NOT NULL
);
