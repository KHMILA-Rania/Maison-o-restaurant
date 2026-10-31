import "./index.css"
import './App.css'
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainLayout from "./Layouts/MainLayout"
import About from "./pages/About"

function App() {


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout></MainLayout>}>
           <Route path="/" element={<Home></Home>}></Route>
           <Route path="/aboutUs" element={<About></About>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
