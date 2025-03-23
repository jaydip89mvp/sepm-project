import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import {Home} from './pages/Home.jsx'
import {LoginPage} from './components/Auth/LoginPage.jsx'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard.jsx'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import ManagerDashboard from './components/Dashboard/ManagerDashboard.jsx'
import AdminDashboard from './components/Dashboard/AdminDashboard.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>

    // <BrowserRouter>
    //   <EmployeeDashboard />
    // </BrowserRouter>

  )
}

export default App