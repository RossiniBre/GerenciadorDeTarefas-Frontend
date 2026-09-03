# TaskNexus — Frontend

Frontend application for the **TaskNexus** project.

TaskNexus is a full-stack task management application developed as a practical project for learning and applying modern software engineering and frontend development practices.

The frontend was initially developed using **HTML, CSS, and JavaScript**, and was later migrated to **React with Vite**, while preserving the application's existing functionality and backend integration.

The project focuses on **Clean Code, SOLID principles, separation of responsibilities, maintainability, reusable components, and practical frontend architecture**.

---

## Backend

This frontend consumes the REST API provided by the TaskNexus backend.

**Backend Repository:**

https://github.com/RossiniBre/GerenciadorDeTarefas-Backend

---

## What's Implemented

### Phase 1 — Foundation and Prototyping

The initial phase established the frontend structure and defined the application's visual identity and user experience.

* Initial project structure
* Interface prototyping
* Frontend environment setup
* Initial integration with the backend API
* Initial visual identity and UI design

### Phase 2 — Authentication

Authentication screens and user flows were implemented and integrated with the backend.

* User login
* User registration
* Password recovery
* Password reset using a token sent by email
* Form validation
* Password visibility controls
* Navigation between authentication screens
* Integration with the backend authentication API
* Authenticated user navigation

### Phase 3 — Task Management

Core task management functionality was implemented and integrated with the backend.

* Task creation
* Task listing
* Task editing
* Task deletion
* Task status management
* Task priority management
* Task category management
* Task search
* Task filtering
* Task details
* Task date and time handling
* Task modal interactions

### Phase 4 — User Account Management

User account management functionality was implemented and integrated with the authenticated user API.

* My Account page
* Display of current user information
* User details editing
* Username editing
* Display name editing
* Email editing
* Account deletion
* Integration with the authenticated user API

### Phase 5 — Task Organization and Calendar

Task organization and calendar functionality were added to improve task visualization and productivity.

* Calendar page
* Calendar-based task visualization
* Dynamic task rendering by date
* Task organization by day
* Calendar navigation
* Task date and time handling
* Integration with existing task data
* Calendar-specific styling
* Light mode support

### Phase 6 — Nexus IA

The **Nexus IA** assistant was integrated into the frontend, providing a conversational interface for interacting with the TaskNexus task management system.

The assistant communicates with the backend AI system and supports contextual conversations and task-related actions.

* Nexus IA interface
* Conversational chat interface
* Conversation context persistence
* Clear conversation functionality
* Task creation through natural language
* Task editing through natural language
* Task deletion through natural language
* Task-related information and queries
* Self-description and assistant capabilities
* Context-aware follow-up interactions
* Requests for missing information when necessary
* Confirmation flows for task actions
* Refusal of requests outside the assistant's defined scope
* Integration with the Nexus IA backend API
* Light mode support

The AI behavior, supported actions, validation, context management, and scope restrictions are handled by the backend. The frontend is responsible for the user interface and interaction layer.

### Phase 7 — Migration to React

The frontend was migrated from the original HTML, CSS, and JavaScript implementation to **React using Vite**.

The migration focuses on replacing the previous page-based structure with a component-based architecture while preserving the application's existing functionality and backend integration.

* React application setup
* Vite development environment
* Component-based architecture
* Reusable React components
* React-based routing and navigation
* Migration of existing interfaces
* Migration of authentication flows
* Migration of task management features
* Migration of calendar functionality
* Migration of user account functionality
* Migration of Nexus IA
* Preservation of backend API integration
* UI/UX refinement during migration
* Responsive interface improvements
* Light and dark theme support

---

## Architecture

The frontend is currently organized using a **component-based React architecture**.

```text
src/
├── assets/
│   ├── images/
│   │   └── Favicon.ico
│   │
│   └── ...
│
├── components/
│   ├── Sidebar/
│   ├── ...
│
├── pages/
│   ├── Calendar/
│   ├── Home/
│   ├── Login/
│   ├── MyAccount/
│   ├── NexusIA/
│   ├── Register/
│   ├── ForgotPassword/
│   └── ResetPassword/
│
├── services/
│   └── ...
│
├── App.jsx
├── main.jsx
└── ...
```

> The structure above represents the target React architecture. Individual directories and components may evolve as the migration progresses.

The frontend follows the principle of separating:

* **Pages** — Application screens and page-level composition
* **Components** — Reusable UI components
* **Services** — Communication with external APIs and application services
* **Assets** — Static resources and visual assets

The architecture will continue to evolve as the project incorporates additional patterns such as centralized API communication, state management, TypeScript, and further component abstraction.

---

## Roadmap

| Phase | Status      | Scope                                                            |
| ----- | ----------- | ---------------------------------------------------------------- |
| 1     | Completed   | Foundation, project structure and interface prototyping          |
| 2     | Completed   | Authentication screens and user flows                            |
| 3     | Completed   | Task management screens and interactions                         |
| 4     | Completed   | User account management and profile features                     |
| 5     | Completed   | Task organization, productivity and calendar features            |
| 6     | Completed   | Nexus IA interface and AI-powered task management                |
| 7     | Completed   | Migration to React, UI/UX refinement and responsive improvements |
| 8     | In Progress | Production build and deployment                                  |

---

## Technologies

### Frontend

* HTML5
* CSS3
* JavaScript
* React
* Vite

### Planned / Future

* Advanced state management
* Further component abstraction
* Additional frontend architecture improvements

---

## Goals

The main goals of this project are:

* Learn and apply modern frontend development
* Understand HTML, CSS, and JavaScript fundamentals
* Learn React and TypeScript
* Build reusable and maintainable components
* Consume and integrate with a REST API
* Apply Clean Code and SOLID principles
* Practice frontend architecture and software engineering
* Build a complete full-stack application
* Explore AI-powered interactions in a real-world application
* Continuously improve the application's usability, maintainability, and architecture

---

## Development

This project is developed as a practical learning project, with its architecture evolving alongside the implementation.

The frontend initially started as a traditional HTML, CSS, and JavaScript application and was later migrated to React. The migration is intentionally treated as a **direct replacement of the frontend implementation**, rather than as a separate project or a rewrite with a new backend.

The backend remains the source of the application's business logic, authentication, persistence, task management, and AI-related behavior, while the React application is responsible for the user interface and frontend interaction layer.