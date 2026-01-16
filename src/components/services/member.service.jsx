import axios from "axios"
import { BASE_API_URL } from "../common/constants"
import { authHeader } from "./base.service"

const BASE_URL = BASE_API_URL+"/api/members"

class MemberService {
  getMember(username){
    return axios.get(`${BASE_URL}/${username}`,{headers:authHeader()})
  }

  changeRole(role,username){
    return axios.put(`${BASE_URL}/change/${username}/${role}`,{},{headers:authHeader()})
  }
  
  deleteMember(id){
    return axios.delete(`${BASE_URL}/${id}`,{headers:authHeader()})
  }

  changPassword(newPassword){
    return axios.put(`${BASE_URL}/change-password`,{password:newPassword},{headers:authHeader()})
  }

  verifyPassword(password){
    return axios.post(`${BASE_URL}/verify-password`,{password},{headers:authHeader()})
  }
}

const memberService = new MemberService()
export default memberService
