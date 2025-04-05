# DZI Viewer Project

The DZI Viewer project provides a streamlined way to generate and display Deep Zoom Images (DZI) using a containerized environment. This document provides step-by-step instructions to set up, configure, and troubleshoot the project on a fresh system.

---
## Video Demo
<video src="https://raw.githubusercontent.com/saupradhan/privacy-assured-media/main/DZI%20Project.mp4" controls width="600">
  Sorry, your browser doesn't support embedded videos.
</video>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Steps to Run the Project](#steps-to-run-the-project)
   - [Clone the Repository](#1-clone-the-repository)
   - [Move into the Project Directory](#2-move-into-the-project-directory)
   - [Set Up the `.env` File](#3-set-up-the-env-file)
   - [Build and Run the Containers](#4-build-and-run-the-containers)
   - [Verify PostgreSQL Database](#5-verify-postgresql-database)
   - [Check and Create the Users Table](#6-check-and-create-the-users-table)
   - [Insert a Sample User](#7-insert-a-sample-user)
   - [Upload an Image for DZI Processing](#8-upload-an-image-for-dzi-processing)
   - [Test the Client](#9-test-the-client)
4. [Troubleshooting](#troubleshooting)
5. [Conclusion](#conclusion)

---

## Introduction
The DZI Viewer project is designed to generate Deep Zoom Images (DZI) and display them in a React-based client. It uses Docker for containerization, making it platform-independent and easy to deploy.

---

## Prerequisites
Before starting, ensure you have the following installed:
- **Git** – To clone the repository.
- **Docker & Docker Compose** – For containerized execution.
- **PostgreSQL** – Database for user authentication.

---

## Steps to Run the Project

### 1. Clone the Repository
Pull the latest version of the project from GitHub:

```bash
git clone https://github.com/saupradhan/privacy-assured-media.git
```

### 2. Move into the Project Directory
Navigate to the project directory:

```bash
cd .\privacy-assured-media\
```

### 3. Set Up the `.env` File
Create a `.env` file in the `server/` directory and add the following environment variables:

```plaintext
# Client Environment
REACT_APP_API_URL=http://server:3001/dzi-files

# Server Environment
DZI_DIR=/app/public/images/Images
INPUT_DIR=/app/input_images
OUTPUT_DIR=/app/public/images/Images
PORT=3001

# Database Configuration
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=postgres  
DB_PORT=5432
DB_NAME=users 

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```
### To generate a Gmail App Password for secure email authentication, follow these steps:

### Step 1: Enable 2-Step Verification
- Go to Google Account Security: https://myaccount.google.com/security
- Scroll down to "Signing in to Google".
- Click 2-Step Verification and follow the instructions to enable it.
### Step 2: Generate an App Password
- After enabling 2-Step Verification, return to Google Account Security.
- Under "Signing in to Google", click App Passwords or Search App passwords in Security Section.
- If prompted, enter your Google password to proceed.
- A 16-character App Password will be displayed. Copy and save it securely.
- Note: While pasting it to .env there will be no spaces in 16-character App Password.
Step 3: Use the App Password in Your Project
Update your .env file:
```plaintext
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Ensure the following directories exist inside the server folder:

```bash
mkdir -p ./server/input_images
mkdir -p ./server/public/images/Images
```

### 4. Build and Run the Containers
Execute the following command to build and run the Docker containers:

```bash
docker-compose up --build
```

### 5. Verify PostgreSQL Database
In a new terminal, open the PostgreSQL container:

```bash
docker exec -it <postgres-container-id> psql -U postgres -d users
```

Replace `<postgres-container-id>` with your PostgreSQL container's ID. 

### 6. Check and Create the Users Table
Once inside the PostgreSQL shell, check if the `users` table exists. If not, execute the following:

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    userEmail VARCHAR(255) UNIQUE NOT NULL
);
```

### 7. Insert a Sample User
Insert a test user into the database:

```sql
INSERT INTO users (userEmail) VALUES ('testEmailAddress@xyz.com');
```

Verify data in table
```sql
select * from users;
```
### 8. Upload an Image for DZI Processing
Place an image inside `/server/input_images/`, or copy an image into the running `dzi-daemon` container:

```bash
docker cp "<path_of your_image>" dzi-daemon:/app/input_images/
```

Verify that the image is inside `./server/input_images
`.
Verify that the system generates a DZI and thumbnail inside `./server/public/images/Images/`.
### 9. Test the Client
Finally, open your browser and navigate to:

```plaintext
http://localhost:3000
```

Ensure the frontend loads properly and displays the Deep Zoom Images.

---

## Troubleshooting

### Issue 1: Docker Fails to Build or Start
- Ensure Docker Desktop is running.
- Restart Docker and re-run `docker-compose up --build`.
- Check if WSL2 (for Windows users) is properly configured.

### Issue 2: Database Connection Issues
- Verify the `DATABASE_URL` in `.env` is correctly set.
- Run `docker ps` to ensure the PostgreSQL container is running.
- Connect manually using:

```bash
docker exec -it <postgres-container-id> psql -U postgres -d users
```

### Issue 3: Images Not Processing
- Check if images are inside `./server/input_images/`.
- Restart the `dzi-daemon` container and check logs.

### Issue 4: Client Not Loading
- Ensure the frontend container is running (`docker ps`).
- Check the browser console for errors (`F12 > Console`).

---

## Conclusion
Following this guide, you should be able to set up, run, and troubleshoot the DZI Viewer project with ease. Ensure all environment variables and directories are correctly configured for smooth operation. 🚀
