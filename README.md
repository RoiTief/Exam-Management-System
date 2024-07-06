# Exam Management System

The Exam Management System is a comprehensive tool designed to create and maintain multiple-choice questions, including meta questions. It supports exam creation and provides a user-friendly catalog for viewing exams.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
  - [Rest API Server](#rest-api-server)
  - [LaTeX Compiler Server](#latex-compiler-server)
  - [React Client](#react-client)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview

The system is responsible for creating and maintaining multiple-answer meta questions. Each question consists of:
- **Stem**: The main body of the question.
- **Keys**: The correct answers.
- **Distractors**: The incorrect answers.
- **Keywords**: Tags that help filter meta questions.
- **Appendix**: Additional information or resources (optional).

The system also facilitates the creation of exams and saves them in a catalog that is easy to navigate.

## Architecture

The Exam Management System consists of two servers and a React client.

### Rest API Server

The Rest API server handles all data manipulation and storage. It includes the following modules, each with backend (BE) and data access layers (DAL):

- **User Manager**: Manages user data and authentication.
- **Task Manager**: Manages tasks and assignments related to exam creation.
- **MetaQuestion Manager**: Handles the creation and management of meta questions.
- **Exam Manager**: Manages exam creation, storage, and retrieval.

### LaTeX Compiler Server

The LaTeX Compiler server converts LaTeX code into PDF format. This is useful for generating professional-looking exam papers.

### React Client

The React client provides a user interface for interacting with the system. It includes the following pages:

- **index**: Home page.
- **course-staff**: Page for course staff to manage exams and questions.
- **generate-exam**: Interface for generating new exams.
- **past-exams**: Catalog of past exams.
- **admin**:
  - **users**: Manage user accounts.
- **auth**:
  - **login**: User authentication page.
- **catalog**:
  - **appendices**: Manage appendices.
  - **questions**: Manage questions.
- **create**:
  - **appendix**: Create new appendices.
  - **appendix-plus-question**: Create appendices and questions together.
  - **choose-appendix**: Select appendices for questions.
- **work**:
  - **tag**: Manage tags for questions.

## Features

- Create and manage multiple-answer meta questions.
- Generate and manage exams.
- Convert LaTeX code to PDF for professional exam documents.
- User-friendly catalog for viewing past exams.
- Comprehensive user management for administrators.
- Tagging system for efficient question management.

## Installation

To install the Exam Management System, follow these steps:

1. Clone the repository.
2. Install dependencies for the Rest API server, LaTeX Compiler server, and React client.
3. Configure environment variables as required.
4. Run the servers and the client.

## Usage

1. Navigate to the home page.
2. Log in with your credentials.
3. Use the course-staff page to manage exams and questions.
4. Generate new exams using the generate-exam page.
5. View past exams in the past-exams catalog.
6. Administrators can manage users from the admin page.

## Contributing

We welcome contributions to the Exam Management System. To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
