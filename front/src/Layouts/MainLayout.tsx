import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Reservation from '../pages/Reservation' // adjust to where your file is

export type LayoutContext = { onBook: () => void }

const MainLayout = () => {
  const [booking, setBooking] = useState(false)
  const openBooking = () => setBooking(true)

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar onBook={openBooking} />
      <Outlet context={{ onBook: openBooking } satisfies LayoutContext} />
      <Reservation open={booking} onClose={() => setBooking(false)} />
    </div>
  )
}

export default MainLayout