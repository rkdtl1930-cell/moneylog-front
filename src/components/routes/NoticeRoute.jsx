import { Navigate, Outlet } from "react-router-dom";
import useUserStore from "../store/useUserStore"; // 경로는 네 프로젝트에 맞게!

export default function AdminRoute() {
  const user = useUserStore((state) => state.user);

  const isLoggedIn = !!user?.id; 
  const isAdmin = user?.role === "ADMIN" || user?.isAdmin === true;

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    alert("관리자만 접근할 수 있습니다.");
    return <Navigate to="/notice/list" replace />;
  }

  return <Outlet />;
}