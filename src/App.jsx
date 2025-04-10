// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import store from './redux/store';
// import './App.css';

// import { Home } from './pages/Home.jsx';
// import LoginPage from './components/Auth/LoginPage';
// import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
// import ManagerDashboard from './components/Dashboard/ManagerDashboard';
// import AdminDashboard from './components/Dashboard/AdminDashboard';
// import Unauthorized from './pages/Unauthorized';

// import ProtectedRoute from './components/Auth/ProtectedRoute';

// const App = () => {
//   return (
//     <Provider store={store}>
//       <Router>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/unauthorized" element={<Unauthorized />} />

//           {/* Protected Routes - Admin */}
//           <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
//             <Route path="/admin/dashboard" element={<AdminDashboard />} />
//           </Route>

//           {/* Protected Routes - Employee */}
//           <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE']} />}>
//             <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
//           </Route>

//           {/* Protected Routes - Manager */}
//           <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
//             <Route path="/manager/dashboard" element={<ManagerDashboard />} />
//           </Route>

//           {/* Catch-All Route */}
//           <Route path="*" element={<Unauthorized />} />
//         </Routes>
//       </Router>
//     </Provider>
//   );
// };

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import './App.css';

import { Home } from './pages/Home.jsx';
import LoginPage from './components/Auth/LoginPage';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import ManagerDashboard from './components/Dashboard/ManagerDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import Unauthorized from './pages/Unauthorized';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Unauthorized />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
