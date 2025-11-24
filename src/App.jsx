
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Trips from "./pages/Trips";
import Booking from "./pages/Booking";
import ViewBookings from "./pages/ViewBookings";
import Navbar from "./Components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ paddingTop: "60px" }}>
        <Routes>
          <Route path="/" element={<Trips />} />
          <Route path="/booking/:tripId" element={<Booking />} />
          <Route path="/bookings" element={<ViewBookings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
