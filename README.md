# Vault.js Backend Server

Proof of concept Cloud-centric database backup utility for PostgreSQL, MongoDB, and MySQL. Provides a web API that clients can use to interact and perform these actions.
This repository contains the server's source code and is part of a NitHub project.

## Features

- User authentication/authorization.
- Database connection detail encryption (end-to-end).
- Supports backups to PostgreSQL, MongoDB, and MySQL.
- Supports downloading database backups via signed URLs.
- Supports database restoration from backup files.
- API endpoints documented using Swagger Open API spec.
- Backups are compressed and uploaded to cloud storage.

## Specification

Full specs [here (roadmap.sh)](https://roadmap.sh/projects/database-backup-utility)

- Allow users to create accounts, sign in and log out.
- Make sure database connection details are encrypted on the client and server.
- Allow backup and restore for different database systems via appropriate endpoints.
- Allow users to schedule routine backups via cron jobs.
- Enforce best security practices.

## Technologies

- NodeJs (Typescript & ExpressJs).
- PostgreSQL.
- MongoDB.
- Redis.
- Docker.
- Swagger (docs).
- BackBlaze (S3 Compatible Cloud BLOB Storage).

## API Documentation

The documentation is generated and served using swagger. You can access it from your own instance using the `/docs` endpoint.

## Configuration (Linux & Unix Environments)

Before running the server, make sure you generate the `swagger.json` spec file using this command:

```sh
chmod +x ./scripts/swagger.sh
./scripts/swagger.sh
```

1. Install npm packages using `yarn install`.
2. Configure environment variables using the `.env.example` template, see the configuration options [here.](#environment-variables)
3. Generate public and private keys using `./scripts/genkeys.sh`
4. Encrypt test connection details using `./scripts/encryptor.sh`, from your .conf.json file, details [here.](#testing-encryption)
5. Perform prisma migrations using `./scripts/db.sh --migrate`
6. Start the development server using `./scripts/dev.sh`

These scripts need execution permission which you can grant using `chmod +x <path-to-script>`


## Test Encryption

If you need to establish a database connection without the web client:

1. Create a `.conf.json` file in the root directory. 
2. You can then put in the connection details and run `./scripts/encryptor.sh` to get it's encrypted form using the public key.

**Note: The public and private key files must have already been generated from the `./scripts/genkeys.sh` script before executing this one.**

Never commit your `.conf.json` file to git.

## Environment Variables

| Variable | Description |
| -------- | ----------- |
| PORT     | Server port number |
| HOSTNAME | Default is "localhost", replace with your deployed server hostname |
| ENVIRONMENT | The environment the server is running on, either "dev" or "prod" |
| ACCESS_TOKEN_KEY | Secret key for signing access tokens |
| REFRESH_TOKEN_KEY | Secret key for generating refresh tokens |
| DATABASE_URL | PostgreSQL connection url |
| REDIS_URI | Redis database connection uri |
| BACKBLAZE_APP_KEY_ID | Your backblaze key id |
| BACKBLAZE_APP_KEY | Your backblaze key |
| BACKBLAZE_BUCKET_ID | Your backblaze bucket id |
| BACKBLAZE_BUCKET_NAME | Your backblaze bucket name |
