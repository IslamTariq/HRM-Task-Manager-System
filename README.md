# HRMS - Human Resource Management System

A modern, full-stack Human Resource Management System built with Vue.js and Express.js. This application provides comprehensive employee management, department tracking, and leave management capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Configuration](#project-configuration)

## ✨ Features

- **Employee Management**
  - Add, view, and delete employees
  - Employee details including personal information, contact details, and employment data
  - Employee overview with statistics and charts

- **Department Management**
  - Create and manage departments
  - Department statistics and overview
  - Visual representation with donut charts

- **Leave Management**
  - Request and track employee leave/vacations
  - Leave type management (paid holiday, sick leave, etc.)
  - Leave quota tracking per employee
  - Leave summary and analytics

- **Dashboard**
  - Comprehensive HR dashboard with key metrics
  - Sector overview with visual charts
  - Employee statistics
  - Upcoming birthdays and training sessions
  - Quick shortcuts for common tasks

- **User Interface**
  - Modern, responsive design with Vuetify
  - Material Design components
  - Intuitive navigation with drawer menu
  - Login page with authentication flow

## 🛠 Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vuetify 3** - Material Design component framework
- **Vue Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Chart.js** - Data visualization
- **Vite** - Build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5** - Web application framework
- **ES Modules** - Modern JavaScript modules

### Testing
- **Cypress** - End-to-end testing framework

## 📁 Project Structure

```
HRMS/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # Vue components
│   │   ├── views/         # Page views
│   │   ├── router/         # Vue Router configuration
│   │   ├── plugins/        # Vuetify plugin
│   │   ├── api.js         # API client configuration
│   │   └── main.js        # Application entry point
│   ├── cypress/           # E2E tests
│   │   ├── e2e/          # Test files
│   │   ├── fixtures/     # Test data
│   │   └── support/      # Custom commands and config
│   ├── public/            # Static assets
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   ├── cypress.config.js  # Cypress configuration
│   └── package.json       # Frontend dependencies
│
└── server/                # Backend application
    ├── src/
    │   ├── controllers/   # Route controllers
    │   ├── routes/        # API routes
    │   ├── db.js          # In-memory database
    │   ├── app.js         # Express app configuration
    │   └── server.js      # Server entry point
    └── package.json       # Backend dependencies
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 20.19.0 or >= 22.12.0)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm** (comes with Node.js)
  - Verify installation: `npm --version`

## 🚀 Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd HRMS
   ```

2. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd ../server
   npm install
   ```

## ▶️ Running the Project

The project consists of two separate applications that need to run simultaneously:

### Option 1: Run in Separate Terminals (Recommended)

**Terminal 1 - Start the Backend Server:**
```bash
cd server
npm run dev
```

The server will start on `http://localhost:3000`

**Terminal 2 - Start the Frontend Client:**
```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`

### Option 2: Run Server Only (Production Mode)

**Backend Server:**
```bash
cd server
npm run server
```

**Frontend Build:**
```bash
cd client
npm run build
npm run preview
```

## 🌐 Accessing the Application

Once both servers are running:

1. Open your web browser
2. Navigate to `http://localhost:5173`
3. You'll see the login page
4. Click "Login" to access the dashboard (authentication is currently simplified for development)

## 📡 API Endpoints

The backend API runs on `http://localhost:3000` and provides the following endpoints:

### Employees
- `GET /employees` - Get all employees
- `GET /employees/:email` - Get employee by email
- `POST /employees` - Add a new employee
- `DELETE /employees/:email` - Delete an employee

### Departments
- `GET /departments` - Get all departments
- `POST /departments` - Add a new department
- `DELETE /departments/:name` - Delete a department

### Leaves
- `GET /leaves` - Get all leave records (optional query: `?employeeEmail=email@example.com`)
- `GET /leaves/summary` - Get leave summary by employee (query: `?employeeEmail=email@example.com&year=2025`)
- `POST /leaves` - Add a new leave record
- `DELETE /leaves/:id` - Delete a leave record

## 🧪 Testing

This project includes comprehensive end-to-end (E2E) testing using Cypress.

### Prerequisites for Testing

1. **Start both servers** before running tests:
   ```bash
   # Terminal 1 - Start backend server
   cd server
   npm run dev

   # Terminal 2 - Start frontend client
   cd client
   npm run dev
   ```

2. Ensure both servers are running:
   - Backend: `http://localhost:3000`
   - Frontend: `http://localhost:5173`

### Running Tests

#### Open Cypress Test Runner (Interactive Mode)

This opens the Cypress GUI where you can see and interact with tests:

```bash
cd client
npm run test:e2e:open
```

#### Run All Tests (Headless Mode)

Run all tests in the terminal without opening the browser:

```bash
cd client
npm run test:e2e
```

#### Run Tests in Specific Browser

**Chrome:**
```bash
npm run test:e2e:chrome
```

**Firefox:**
```bash
npm run test:e2e:firefox
```

**Headed Mode (see browser):**
```bash
npm run test:e2e:headed
```

### Test Structure

The test suite is organized in `client/cypress/e2e/`:

- **`login.cy.js`** - Tests for login page functionality
  - Form validation
  - Email validation
  - Successful login flow

- **`dashboard.cy.js`** - Tests for dashboard page
  - Dashboard display
  - Navigation drawer
  - Statistics and overview

- **`employee.cy.js`** - Tests for employee management
  - Employee form
  - Form validation
  - Employee CRUD operations

- **`department.cy.js`** - Tests for department management
  - Department form
  - Department creation
  - Department listing

- **`vacations.cy.js`** - Tests for leave/vacation management
  - Leave request form
  - Leave validation
  - Leave summary and charts

- **`navigation.cy.js`** - Tests for navigation and routing
  - Route navigation
  - Navigation drawer
  - Route redirects

### Custom Commands

Cypress custom commands are available in `cypress/support/commands.js`:

- `cy.login()` - Automatically logs in to the application
- `cy.navigateTo(route)` - Navigate to a specific route
- `cy.waitForApi()` - Wait for API calls to complete

**Example usage:**
```javascript
describe('My Test', () => {
  it('should test something', () => {
    cy.login()  // Uses custom login command
    cy.navigateTo('/employee/add')
    // ... rest of test
  })
})
```

### Test Data

Test fixtures are located in `cypress/fixtures/example.json`:
- Sample employee data
- Sample department data
- Sample leave data

**Example usage:**
```javascript
cy.fixture('example').then((data) => {
  const employee = data.employee
  // Use employee data in test
})
```

### Writing New Tests

1. Create a new test file in `cypress/e2e/`:
   ```javascript
   describe('Feature Name', () => {
     beforeEach(() => {
       cy.login()  // Login before each test
     })

     it('should do something', () => {
       cy.visit('/some-route')
       // Your test code here
     })
   })
   ```

2. Follow Cypress best practices:
   - Use descriptive test names
   - Keep tests independent
   - Use custom commands for common actions
   - Wait for elements to be visible before interacting

### Test Configuration

Cypress configuration is in `client/cypress.config.js`:
- Base URL: `http://localhost:5173`
- Viewport: 1280x720
- Video recording: Enabled
- Screenshots on failure: Enabled
- Default command timeout: 10 seconds

### Continuous Integration

To run tests in CI/CD pipelines:

```bash
# Install dependencies
npm install

# Start servers in background and run tests
npm run test:e2e
```

### Troubleshooting Tests

**Tests fail with "Cannot connect to server":**
- Ensure both backend and frontend servers are running
- Check that ports 3000 and 5173 are not blocked

**Tests timeout:**
- Increase timeout in `cypress.config.js`
- Check if API calls are completing
- Verify server is responding correctly

**Element not found:**
- Use `cy.wait()` to wait for elements to load
- Check if selectors match the actual DOM structure
- Verify the page has fully loaded before assertions

## ⚙️ Project Configuration

### Frontend Configuration
- **Port**: 5173 (default Vite port)
- **API Proxy**: Requests to `/api/*` are proxied to `http://localhost:3000`
- **Configuration File**: `client/vite.config.js`

### Backend Configuration
- **Port**: 3000
- **CORS**: Enabled for all origins (development mode)
- **Data Storage**: In-memory (data resets on server restart)

### Environment Variables
Currently, the project uses default configurations. To customize:

**Server Port** (optional):
```bash
# Set PORT environment variable
PORT=3001 npm run dev
```

## 🔧 Development Notes

- The server uses **in-memory storage** - data will be lost when the server restarts
- CORS is enabled for development - adjust for production use
- The login page currently bypasses authentication for development purposes
- Hot module replacement (HMR) is enabled for both frontend and backend

## 📝 Available Scripts

### Client Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier
- `npm run test:e2e` - Run Cypress tests (headless)
- `npm run test:e2e:open` - Open Cypress test runner (interactive)
- `npm run test:e2e:headed` - Run tests with browser visible
- `npm run test:e2e:chrome` - Run tests in Chrome browser
- `npm run test:e2e:firefox` - Run tests in Firefox browser

### Server Scripts
- `npm run dev` - Start server with nodemon (auto-restart on changes)
- `npm run server` - Start server with node

## 🐛 Troubleshooting

### Port Already in Use
If you encounter port conflicts:

**For port 3000 (server):**
```powershell
# Windows PowerShell
netstat -ano | findstr ":3000"
taskkill /F /PID <process_id>
```

**For port 5173 (client):**
```powershell
# Windows PowerShell
netstat -ano | findstr ":5173"
taskkill /F /PID <process_id>
```

### Dependencies Issues
If you encounter dependency errors:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
If you see CORS errors, ensure:
1. The server is running on port 3000
2. CORS middleware is enabled in `server/src/app.js`
3. The client proxy is configured correctly in `client/vite.config.js`

## 📄 License

ISC

## 👤 Author

Islam Tariq

---

**Note**: This is a development version. For production deployment, consider:
- Implementing proper authentication and authorization
- Using a persistent database (PostgreSQL, MongoDB, etc.)
- Configuring proper CORS policies
- Adding environment variable management
- Implementing error logging and monitoring

