
CREATE TABLE location (
  id_location SERIAL,
  city VARCHAR(200),
  street_name VARCHAR(200),
  street_number INTEGER,
  zip VARCHAR(50),
  country VARCHAR(200),
  name VARCHAR(200),
  latitude NUMERIC,
  longitude NUMERIC,
  PRIMARY KEY (id_location)
);

CREATE TABLE person (
  id_person SERIAL,
  nickname VARCHAR(200),
  first_name VARCHAR(200),
  last_name VARCHAR(200),
  id_location INTEGER,
  birth_day DATE,
  height INTEGER,
  gender VARCHAR(1),
  PRIMARY KEY (id_person),
  FOREIGN KEY (id_location) REFERENCES location(id_location) ON DELETE SET NULL
);

CREATE TABLE contact_type(
  id_contact_type SERIAL,
  name VARCHAR(200),
  validation_regexp VARCHAR(200),
  PRIMARY KEY (id_contact_type)
);

CREATE TABLE contact (
  id_contact SERIAL,
  id_person INTEGER,
  id_contact_type INTEGER,
  contact VARCHAR(200),
  PRIMARY KEY (id_contact),
  FOREIGN KEY (id_person) REFERENCES person(id_person) ON DELETE CASCADE,
  FOREIGN KEY (id_contact_type) REFERENCES contact_type(id_contact_type) ON DELETE CASCADE
);

CREATE TABLE relation_type(
  id_relation_type SERIAL,
  name VARCHAR(200),
  PRIMARY KEY (id_relation_type)
);

CREATE TABLE relation(
  id_relation SERIAL,
  id_person1 INTEGER,
  id_person2 INTEGER,
  description VARCHAR(200),
  id_relation_type INTEGER,
  PRIMARY KEY (id_relation),
  FOREIGN KEY (id_person1) REFERENCES person(id_person) ON DELETE CASCADE,
  FOREIGN KEY (id_person2) REFERENCES person(id_person) ON DELETE CASCADE,
  FOREIGN KEY (id_relation_type) REFERENCES relation_type(id_relation_type) ON DELETE CASCADE
);

CREATE TABLE meeting(
  id_meeting SERIAL,
  start TIMESTAMP,
  description VARCHAR(200),
  duration TIME,
  id_location INTEGER,
  PRIMARY KEY (id_meeting),
  FOREIGN KEY (id_location) REFERENCES location(id_location) ON DELETE CASCADE
);

CREATE TABLE person_meeting(
  id_person INTEGER,
  id_meeting INTEGER,
  PRIMARY KEY (id_person, id_meeting)
);