CREATE USER frey WITH PASSWORD 'pgpass';
CREATE DATABASE frey;
GRANT ALL PRIVILEGES ON DATABASE frey TO frey;
CREATE DATABASE frey_unit;
GRANT ALL PRIVILEGES ON DATABASE frey_unit TO frey;
