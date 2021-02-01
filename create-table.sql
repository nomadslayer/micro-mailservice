CREATE TABLE notification (
	id serial NOT NULL PRIMARY KEY,
	`data` json DEFAULT NULL,
	api_key varchar(255) NULL,
	created_at timestamp NOT NULL DEFAULT NOW()
);