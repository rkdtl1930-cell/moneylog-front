import axios from "axios"
import { BASE_API_URL } from "../common/constants"
import { authHeader } from "./base.service"

const BASE_URL = BASE_API_URL + "/api/members"

class MemberService {
  // 회원 목록 조회 (페이징)
  getMembers(pageRequestDTO) {
    return axios.get(`${BASE_URL}/list`, {
      params: pageRequestDTO,
      headers: authHeader()
    })
  }

  changeRole(role, username) {
    return axios.put(
      `${BASE_URL}/change/${username}/${role}`,
      {},
      { headers: authHeader() }
    );
  }

  deleteMember(id) {
    return axios.delete(`${BASE_URL}/${id}`, { headers: authHeader() })
  }

  verifyPassword(password) {
    return axios.post(`${BASE_URL}/verify-password`, { password }, { headers: authHeader() })
  }

  // 회원 정보 변경 (비밀번호, 닉네임)
  changeInfo(data) {
    return axios.put(`${BASE_URL}/change-info`, data, { headers: authHeader() })
  }
}

const memberService = new MemberService()
export default memberService