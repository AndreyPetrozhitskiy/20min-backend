create TABLE Users(
    "UserID" SERIAL PRIMARY KEY,
    "username" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL
);


CREATE TABLE Projects (
    "ProjectID" SERIAL PRIMARY KEY,
    "NameProject" VARCHAR(255) NOT NULL,
    "DescriptionProject" VARCHAR(100000),
    "LinkFigma" VARCHAR(100000),
    "LinkGit" VARCHAR(100000),
    "PhotoProject" VARCHAR(100000),
    "Status" VARCHAR(255) DEFAULT 'В разработке',
    "Visibility" VARCHAR(255) DEFAULT 'Приватный',
    "CreatorUserID" INTEGER REFERENCES "users" ("UserID")
);

CREATE TABLE ProjectMembers (
    "MemberID" SERIAL PRIMARY KEY,
    "ProjectID" INTEGER REFERENCES "projects" ("ProjectID") ON DELETE CASCADE,
    "UserID" INTEGER REFERENCES "users" ("UserID") ON DELETE CASCADE,
    "Role" VARCHAR(255) NOT NULL
);
