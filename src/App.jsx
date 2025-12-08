
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing";
import Trips from "./Pages/Trips";
import Booking from "./Pages/Booking";
import ViewBookings from "./Pages/ViewBookings";
import CreateTrip from "./Pages/CreateTrip";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Navbar from "./Components/Navbar";
import UserProfile from "./Pages/UserProfile";
import ChangePassword from "./Pages/ChangePassword";
import EditProfile from "./Pages/EditProfile";
import MyTrips from "./Pages/MyTrips";
import Chats from "./Pages/Chats";
import NotificationToast from "./Components/NotificationToast";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <NotificationToast />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/booking/:tripId" element={<Booking />} />
        <Route path="/bookings" element={<ViewBookings />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </BrowserRouter>
  );
}
