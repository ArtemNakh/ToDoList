## TODO LIST 
Simple todo list application

## 🛒 Project Purpose 
The purpose of this project is to develop a modern, production-ready full-stack Task Management Application designed to demonstrate clean architecture, robust state management, and full-stack development best practices. Using NestJS on the backend and Next.js on the frontend with TypeScript across the entire stack, this application serves as a comprehensive playground for implementing secure user authentication, end-to-end type safety, complex CRUD operations, and thorough test coverage (unit and integration testing).


## API Endpoints (Backend)
 * POST /Auth/registration - User registration
 * POST /Auth/login - User login
 * POST /Auth/logout - User logout
 * POST /email-confirmation/verification - Verification account(through email)
 * POST /password-recovery/reset-password - Reset password
 * POST /password-recovery/new/{token} - Recovery password
 * GET /notes/get-all-by-user - Getting all notes for user
 * POST /notes/save - Save new note for auth user
 * DELETE /notes/remove/{noteId} - Remove note by id 
 * PATCH /notes/update/{noteId} - Update note by id

## ✨ Features
- [Note Creation](ca://s?q=Describe_note_creation) — adding new to-do items with a title and description. 
- [Note Editing](ca://s?q=Describe_note_editing) — ability to change the text or title of notes 
- [Note Deletion](ca://s?q=Describe_note_deletion) — deleting unnecessary notes.    
- [Filtering and Sorting](ca://s?q=Describe_filtering_and_sorting) — Search notes by title or context.
- [User Authentication](ca://s?q=Describe_user_authentication) — registration and login for personal lists.
- [Data Storage](ca://s?q=Describe_data_storage) — database support for persistent storage of notes.
- [API Integration](ca://s?q=Describe_api_integration) — REST API for interaction with the frontend or third-party services.

## 🛠 Tech Stack
* Backend
  * Frameworks: Nest.js
  * Database: Mysql
  * Libraries: faker.js,typeorm, vitest,swagger,ioredis,class-transformer,class-validator,express-session,typescript.

* Frontend
  * Framework: Next.js

* DevOps & Infrastructure
  * Docker
  * Git / GitHub

## 📦Installation
* Backend


  Clone the repository:


  ```bash
  git clone https://github.com/ArtemNakh/ToDoList.git
  cd todolist_backend
  npm install
  ```

  Create a .env file and copy the configuration from the example and filling the files:
  ```bash
  cp .example.env .env
  ```
  
  Running with Docker

  ```bash
  docker compose up --built -d
  ```
  
  Make the migration for database
  ```bash
  npm run migration:run
  ```
  
  Running backend
  ```bash
  npm run start
  ```


* Frontend


## 🔌 External Services
- NestJS Mailer (@nestjs-modules/mailer) — service integration used for sending email notifications to users.

## 🚀 Project Status


In Progress / Active Development  
The project is currently under active development. New features are being added, and improvements are continuously being made. Feedback and constructive criticism are always welcome!
