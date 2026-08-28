import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./Components/AppLayout";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicOnlyRoute from "./Components/PublicOnlyRoute";
import NotificationToast from "./Components/NotificationToast";
import Landing from "./Pages/Landing";
import Trips from "./Pages/Trips";
import Booking from "./Pages/Booking";
import ViewBookings from "./Pages/ViewBookings";
import CreateTrip from "./Pages/CreateTrip";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import UserProfile from "./Pages/UserProfile";
import OwnerProfile from "./Pages/OwnerProfile";
import ChangePassword from "./Pages/ChangePassword";
import MyTrips from "./Pages/MyTrips";
import Chats from "./Pages/Chats";
import NotFound from "./Pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <NotificationToast />
      <Routes>
        <Route element={<AppLayout />}>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/trips" element={<Trips />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/booking/:tripId" element={<Booking />} />

          {/* Protected routes — require token */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <ViewBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-trips"
            element={
              <ProtectedRoute>
                <MyTrips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/:userId"
            element={
              <ProtectedRoute>
                <OwnerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <Chats />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
