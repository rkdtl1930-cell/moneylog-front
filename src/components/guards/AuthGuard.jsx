import { Navigate } from "react-router-dom"
import useUserStore from "../store/useUserStore"

const AuthGuard = ({children, roles}) =>{
  const currentUser = useUserStore((state)=>state.user)
  const authorize = () =>{
    if(!currentUser){
      return <Navigate to="/401"/>
    }
    if(roles?.indexOf(currentUser.role)==-1){
      return <Navigate to="/401"/>
    }
    return children
  }
  return authorize()
}
export default AuthGuard