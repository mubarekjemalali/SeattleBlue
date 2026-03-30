import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminRouteGuard from "./pages/admin/AdminRouteGuard";
import ManageBookingPage from "./pages/ManageBookingPage";
import AdminDriversPage from "./pages/admin/AdminDriversPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
         <Route path="/manage-booking" element={<ManageBookingPage />} />
         <Route path="/contact" element={<ContactPage />} />
         <Route path="/about" element={<AboutPage />} />

{/*        <Route path="/admin/login" element={<AdminLoginPage />} /> */}

{/*        <Route element={<AdminRouteGuard />}> */}
{/*          <Route path="/admin/dashboard" element={<AdminDashboardPage />} /> */}
{/*        </Route> */}
         <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
         <Route path="/admin/drivers" element={<AdminDriversPage />} />
      </Routes>
    </BrowserRouter>
  );
}
