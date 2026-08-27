# TaskNexus — Frontend

Frontend application for the **TaskNexus** project.

This project is being developed to learn and practice modern frontend development, starting with the fundamentals of **HTML, CSS, and JavaScript**, and progressively introducing **TypeScript, React, and modern frontend tools**.

The main goal is to build a real application while studying good software engineering practices such as **Clean Code, SOLID, separation of responsibilities, maintainability, and reusable components**.

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
* Initial interface prototyping
* Frontend environment setup
* First integration and testing with the backend API

### Phase 2 — Authentication

Authentication screens and user flows have been implemented and integrated with the backend.

* User login
* User registration
* Password recovery
* Password reset using a token sent by email
* Form validation
* Password visibility controls
* Navigation between authentication screens
* Integration with the backend authentication API
* Authenticated user navigation to the home page

### Phase 3 — Task Management

Task management functionality has been implemented and integrated with the backend.

* Task creation
* Task listing
* Task editing
* Task deletion
* Task status management
* Task priority and category management
* Task search
* Task filtering
* Task details
* Task date and time handling
* Task modal interactions

### Phase 4 — User Account Management

User account management functionality has been implemented and integrated with the backend.

* My Account page
* Display of current user information
* User details editing
* Username editing
* Display name editing
* Email editing
* User account deletion
* Integration with the authenticated user API

### Phase 5 — Task Organization and Calendar

Task organization and calendar functionality have been implemented and integrated with the existing task management features.

* Calendar page
* Calendar-based task visualization
* Dynamic task rendering by date
* Task date and time handling
* Task organization by day
* Calendar navigation
* Integration with existing task data
* Calendar-specific styling
* Light mode support for the calendar

---

## Architecture

```text
assets/

├── images/
│   └── Favicon.ico
│
├── css/
│   ├── CalendarPageStyles/
│   │   ├── calendarPage.css
│   │   └── light-mode.css
│   │
│   ├── ForgotPasswordStyles/
│   ├── HomePageStyles/
│   ├── MyAccountPageStyles/
│   ├── RegisterPageStyles/
│   ├── ResetPasswordStyles/
│   └── loginScreen.css
│
├── js/
│   ├── calendarPage.js
│   ├── forgotPassword.js
│   ├── homePage.js
│   ├── loginScreen.js
│   ├── myAccount.js
│   ├── registerPage.js
│   ├── resetPassword.js
│   │
│   └── utils/
│       ├── components.js
│       ├── sidebar.js
│       ├── tasks.js
│       └── transition.js
│
├── pages/
│   ├── components/
│   │   └── sidebar.frag
│   │
│   ├── CalendarPage.html
│   ├── ForgotPassword.html
│   ├── HomePage.html
│   ├── MyAccount.html
│   ├── RegisterPage.html
│   └── ResetPassword.html
│
└── InitialScreen.html
```

The frontend is currently organized by responsibility:

* `assets/` — Static resources used by the application
* `assets/images/` — Images and visual assets used by the application
* `css/` — Stylesheets and visual presentation
* `js/` — JavaScript logic and interactions
* `js/utils/` — Shared JavaScript utilities and application-wide behavior
* `pages/` — Application pages and interfaces
* `pages/components/` — Reusable HTML components shared across application pages

The architecture will evolve as new features are introduced, eventually incorporating reusable components, centralized API communication, application state management, TypeScript, and React.

---

## Roadmap

| Phase | Status      | Scope                                                        |
| ----- | ----------- | ------------------------------------------------------------ |
| 1     | Completed   | Foundation, project structure and interface prototyping      |
| 2     | Completed   | Authentication screens and user flows                        |
| 3     | Completed   | Task management screens and interactions                     |
| 4     | Completed   | User account management and profile features                 |
| 5     | Completed   | Task organization, productivity and calendar features        |
| 6     | In Progress | AI assistant interface and integration                       |
| 7     |             | UI/UX refinement, responsiveness and architecture refinement |
| 8     |             | Production build and deployment                              |

---

## Technologies

The project will progressively explore technologies commonly used in modern frontend development:

* HTML5
* CSS3
* JavaScript
* TypeScript
* React
* Vite

Additional tools and technologies may be introduced as the project evolves.

---

## Goals

The main goals of this project are:

* Learn modern frontend development
* Understand HTML, CSS, and JavaScript fundamentals
* Learn TypeScript and React
* Build reusable and maintainable components
* Consume a REST API
* Apply Clean Code and SOLID principles
* Practice frontend architecture and software engineering
* Build a complete full-stack application