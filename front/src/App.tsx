import "./index.css"
import './App.css'
import { useState } from "react"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainLayout from "./Layouts/MainLayout"
import About from "./pages/About"
import Menu from "./pages/Menu"
import Reservation from "./pages/Reservation"

function App() {
  const [booking, setBooking] = useState(false)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout></MainLayout>}>
           <Route path="/" element={<Home></Home>}></Route>
           <Route path="/aboutUs" element={<About></About>}></Route>
            <Route path="/menu" element={<Menu></Menu>}></Route>
           
        </Route>
      </Routes>
      <Reservation open={booking} onClose={() => setBooking(false)} />
      
    </BrowserRouter>
    </>
  )
}

export default App
