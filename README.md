# Web App — Node.js + Express + SQLite (Users)

A tiny web application built for a DevOps/CI-CD assignment. It demonstrates a simple CRUD-ish flow using Express (views rendered with EJS) and a local SQLite database file. It includes a Docker image for the app, a dedicated Dockerfile to run Selenium UI tests in CI, and a Jenkins pipeline.

## Overview

- Tech stack: Node.js 18, Express 4, EJS 3, SQLite3
- Database: SQLite file stored at `database.sqlite3` in the project root
- Default port: `3000` (configurable via `PORT` env var)
- Views: `EJS` templates in `./views`
- Static assets: `./public` (served at `/`)
- Tests: Selenium WebDriver + Mocha, runnable in a dedicated Docker image

## Features

- Home page with navigation
- Users list with seed data (Alice and Bob) created on first run
- Add new user via a form (name, email)
- Minimal server-side validation on POST
- Clean, responsive EJS templates and basic CSS

## Routes

- `GET /` — Home
- `GET /users` — List users (table)
- `GET /users/new` — Show “Add user” form
- `POST /users` — Create a new user, then redirect to `/users`

## Project structure

```
app.js                 # Express server (routes, middleware)
db.js                  # SQLite connection, table init, seed data
views/                 # EJS templates (index, users, new_user)
public/styles.css      # Simple styling
tests/selenium/*.js    # UI tests with Selenium + Mocha
Dockerfile             # App runtime image (node:18-alpine)
Dockerfile.selenium    # Selenium tests image (Chrome + Chromedriver)
Jenkinsfile            # Example CI pipeline (Dockerized test flow)
package.json           # Scripts and dependencies
```

## Prerequisites

Choose one of the following ways to run the app:

1) Local Node.js
- Node.js 18+ and npm installed

2) Docker
- Docker Desktop installed and running

For running Selenium tests locally (outside Docker), you also need Google Chrome and a compatible Chromedriver available on PATH. The recommended path is to run the tests inside the provided Docker image instead.

## Quick start (local, Windows PowerShell)

```powershell
cd 'c:\Users\salman\Desktop\university\7th\DevOps\finalP\web-app'
npm install
npm start
# App will listen on http://localhost:3000
```

Environment variables:

- `PORT` — optional. Example:

```powershell
$env:PORT = 4000; npm start
# Now available at http://localhost:4000
```

Database file:

- A SQLite file named `database.sqlite3` will be created in the project root. On first run, the `users` table is created and two seed rows are inserted if the table is empty.

## Docker usage

Build and run the app container:

```powershell
cd 'c:\Users\salman\Desktop\university\7th\DevOps\finalP\web-app'
docker build -t web-app:latest .
docker run --rm -p 3000:3000 --name web-app web-app:latest
# Open http://localhost:3000
```

Note: The app writes the SQLite DB file inside the container’s `/app` directory. Stopping/removing the container will discard that data unless you mount a volume, e.g.:

```powershell
docker run --rm -p 3000:3000 -v ${PWD}:/app --name web-app web-app:latest
```

## Selenium UI tests

There are two test files under `tests/selenium/`:
- `home_and_users.test.js` — navigates Home and Users pages
- `create_user.test.js` — fills the Add User form and verifies the listing

The tests use `BASE_URL` env var (default `http://127.0.0.1:3000`).

Run tests locally (requires Chrome + Chromedriver):

```powershell
cd 'c:\Users\salman\Desktop\university\7th\DevOps\finalP\web-app'
# Ensure the app is running locally first
npm test
```

Recommended: run tests inside Docker (Chrome preinstalled):

```powershell
cd 'c:\Users\salman\Desktop\university\7th\DevOps\finalP\web-app'
docker build -f Dockerfile.selenium -t web-app-tests:latest .

# Option A: If the app runs on the host at localhost:3000
# (Note: Docker Desktop on Windows does not support --network host.)
docker run --rm -e BASE_URL=http://host.docker.internal:3000 web-app-tests:latest

# Option B: Run app and tests on the same user-defined bridge network
docker network create webapp_net
docker run -d --rm --name webapp_app --network webapp_net -p 3000:3000 web-app:latest
docker run --rm --name webapp_tests --network webapp_net -e BASE_URL=http://webapp_app:3000 web-app-tests:latest
docker rm -f webapp_app; docker network rm webapp_net
```

## Jenkins pipeline

`Jenkinsfile` contains a simple, Docker-focused pipeline:

- Clone repo
- “Build” (placeholder step)
- Build app Docker image and run it on a temporary network
- Build Selenium tests image
- Run tests against the app using a shared network and `BASE_URL=http://webapp_app:3000`
- Cleanup containers and network in `post` steps

This is a good starting point for CI and can be extended to push images and deploy to your environment of choice.

## Troubleshooting

- Port already in use: set a different `PORT` (e.g., 4000) when starting the app.
- Windows PowerShell and Docker networking: prefer the shared user-defined network approach and target the app container by name.
- Chrome/Chromedriver mismatch: use the `Dockerfile.selenium` image to avoid local version issues.
- Database not updating: ensure you’re looking at the correct `database.sqlite3` file (host vs container) or mount a volume when using Docker.

## License

For educational purposes. Adapt as needed for your coursework or projects.
