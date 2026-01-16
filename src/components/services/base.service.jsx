import useUserStore from "../store/useUserStore"

const authHeader = () =>{
  const currentUser = useUserStore.getState().user;
  return{
    'Content-Type':'application/json',
    authorization : 'Bearer '+currentUser?.token
  }
}
export {authHeader}