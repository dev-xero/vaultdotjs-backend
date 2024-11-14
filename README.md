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
- Redis.
- Docker
- Swagger (docs)

## Configuration (Linux & Unix Environments)

Before running the server, make sure you generate the `swagger.json` spec file using this command:

```sh
chmod +x ./scripts/swagger.sh
./scripts/swagger.sh
```

1. Install npm packages using `yarn install`.
2. Configure environment variables using the `.env.example` template, see the configuration options [here.](#environment-variables)
3. Perform prisma migrations using `./scripts/db.sh --migrate`
4. Start the development server using `./scripts/dev.sh`

These scripts need execution permission which you can grant using `chmod +x <path-to-script>`

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
