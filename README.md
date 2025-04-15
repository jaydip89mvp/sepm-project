# Inventory Management System

A comprehensive inventory management system built with Spring Boot and React, featuring role-based access control, real-time inventory tracking, and automated reporting.

## Features

### Core Features
- **Role-Based Access Control**
  - Admin: Full system access
  - Manager: Department-specific management
  - Employee: Basic inventory operations
  - Supplier: Product management and order tracking

- **Inventory Management**
  - Product categorization
  - Stock level monitoring
  - Low stock alerts
  - Stock history tracking
  - Automated reorder suggestions

- **Order Management**
  - Customer order processing
  - Supplier order management
  - Order status tracking
  - Payment processing

- **Reporting**
  - Sales reports
  - Inventory reports
  - Financial reports
  - Custom report generation

### Technical Features
- **Frontend**
  - React with Material-UI
  - Responsive design
  - Real-time updates
  - Form validation
  - Error handling

- **Backend**
  - Spring Boot REST API
  - JWT authentication
  - Role-based authorization
  - Data validation
  - Exception handling

## System Architecture

### Frontend Structure
```
src/
├── components/
│   ├── adminsidebar/
│   │   ├── Categorymanagement.jsx
│   │   ├── Managermanagement.jsx
│   │   ├── Report.jsx
│   │   └── Suppliermanagement.jsx
│   ├── Dashboard/
│   │   └── sections/
│   │       └── EmployeeManagement.jsx
│   └── ...
├── services/
│   ├── adminService.js
│   ├── employeeService.js
│   └── ...
└── ...
```

### Backend Structure
```
src/main/java/com/inventory/
├── controller/
│   ├── AdminController.java
│   ├── EmployeeController.java
│   └── ...
├── model/
│   ├── Employee.java
│   ├── Role.java
│   ├── Supplier.java
│   └── ...
├── repository/
│   ├── EmployeeRepository.java
│   ├── RoleRepository.java
│   └── ...
└── service/
    ├── AdminService.java
    ├── EmployeeService.java
    └── ...
```

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Maven
- MySQL 8.0 or higher

### Installation

1. **Backend Setup**
```bash
# Clone the repository
git clone [repository-url]

# Navigate to backend directory
cd inventory-management

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

2. **Frontend Setup**
```bash
# Navigate to frontend directory
cd Inventory-Management-System

# Install dependencies
npm install

# Start the development server
npm start
```

### Configuration

1. **Backend Configuration**
- Update `application.properties` with your database credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/inventory_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

2. **Frontend Configuration**
- Update API endpoints in service files if needed
- Configure environment variables in `.env` file

## API Documentation

### Authentication Endpoints
- `POST /login` - User authentication
- `POST /logout` - User logout

### Admin Endpoints
- `GET /admin/employees` - Get all employees
- `POST /admin/employees` - Add new employee
- `PUT /admin/employees` - Update employee
- `DELETE /admin/employees/{id}` - Delete employee

### Employee Endpoints
- `GET /employee/products` - Get all products
- `POST /employee/orders` - Create new order
- `GET /employee/stock` - Get stock information

### Supplier Endpoints
- `GET /supplier/products` - Get supplier products
- `POST /supplier/orders` - Create supplier order
- `GET /supplier/payments` - Get payment history

## Security

### Authentication
- JWT-based authentication
- Token expiration handling
- Secure password storage

### Authorization
- Role-based access control
- Endpoint security
- CSRF protection

## Error Handling

### Frontend
- Form validation
- API error handling
- User-friendly error messages

### Backend
- Global exception handling
- Custom exceptions
- Error logging

## Testing

### Backend Testing
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=EmployeeServiceTest
```

## Deployment

### Backend Deployment
1. Build the JAR file:
```bash
mvn clean package
```

2. Deploy the JAR file to your server:
```bash
java -jar target/inventory-management-1.0.0.jar
```

### Frontend Deployment
1. Build the production version:
```bash
npm run build
```

2. Deploy the build folder to your web server
