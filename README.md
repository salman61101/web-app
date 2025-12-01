# Simple Node + Express + SQLite User App

This small app is built for a CI/CD assignment.

Features:
- Node.js + Express server
- SQLite database with a `users` table (id, name, email)
- Routes: `/`, `/users`, `/users/new`, POST `/users`
- Seed data: two users inserted automatically if table is empty
- Dockerfile using `node:18-alpine`

Run locally (PowerShell):

```powershell
cd 'c:\Users\salman\Desktop\university\7th\DevOps\web-app'
npm install
node app.js
# then open http://localhost:3000
```

Build Docker image:

```powershell
docker build -t web-app:latest .
docker run -p 3000:3000 web-app:latest
```

This project is ready to be used in a Jenkins pipeline (npm install, build image, run tests, push image, deploy).

## Selenium tests in Docker

Build and run Selenium tests inside a container with Chrome:

```powershell
cd 'c:\Users\salman\Desktop\university\7th\DevOps\web-app'
docker build -f Dockerfile.selenium -t web-app-tests:latest .
# Ensure the app is running (locally or in Docker) at http://127.0.0.1:3000
# Then run tests (container will use npm test)
docker run --network host web-app-tests:latest
```

Note: On Windows Docker Desktop, `--network host` behaves differently; alternatively run the app and tests on a user-defined bridge network and reference the app container name.
