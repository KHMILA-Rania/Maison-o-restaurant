import "./index.css"
import './App.css'
import { useState } from "react"

import Home from "./pages/Home"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainLayout from "./Layouts/MainLayout"
import About from "./pages/About"
import Menu from "./pages/Menu"
import Reservation from "./pages/Reservation"
import Footer from "./components/Footer"
import ComingSoon from "./components/ComingSoon"

function App() {
  const [booking, setBooking] = useState(false)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout></MainLayout>}>
           <Route path="/" element={<Home></Home>}></Route>
           <Route path="/about-us" element={<About></About>}></Route>
            <Route path="/menu" element={<Menu></Menu>}></Route>
            <Route path="/coming-soon" element={<ComingSoon></ComingSoon>}></Route>
           
        </Route>
      </Routes>
      <Reservation open={booking} onClose={() => setBooking(false)} />
      <Footer></Footer>
    </BrowserRouter>
    </>
  )
}

export default App
