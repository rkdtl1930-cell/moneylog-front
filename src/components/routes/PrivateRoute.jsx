import { Navigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";

export default function PrivateRoute({children}){
  const currentUser = useUserStore((state)=>state.user);
  if(!currentUser){
    return <Navigate to="/401" replace/>;
  }
  return children;
}