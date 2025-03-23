import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import {Home} from './pages/Home.jsx'
import {LoginPage} from './components/Auth/LoginPage.jsx'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard.jsx'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>

    // <BrowserRouter>
    //   <EmployeeDashboard />
    // </BrowserRouter>

  )
}

export default App