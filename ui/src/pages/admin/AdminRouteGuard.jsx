import { Navigate, Outlet } from "react-router-dom";
import { isAdminLoggedIn } from "../../auth/adminAuth";

export default function AdminRouteGuard() {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}