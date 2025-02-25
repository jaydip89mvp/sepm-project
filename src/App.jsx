import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import {Home} from './pages/Home.jsx'
import {LoginPage} from './components/Auth/LoginPage.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App