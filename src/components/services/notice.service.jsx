import axios from "axios";
import { BASE_API_URL } from "../common/constants";
import { authHeader } from "./base.service";

const BASE_URL = BASE_API_URL+"/api/notices"

class NoticeService{
  createNotice(notice){
    return axios.post(BASE_URL, notice, {headers:authHeader()})
  }
  getNotice(id){
    return axios.get(`${BASE_URL}/${id}`, {headers:authHeader()})
  }
  updateNotice(id, notice){
    return axios.put(`${BASE_URL}/${id}`,notice,{headers:authHeader()})
  }
  deleteNotice(id){
    return axios.delete(`${BASE_URL}/${id}`,{headers:authHeader()})
  }
  getNotices(page, size){
    return axios.get(`${BASE_URL}/list`,{params:{page,size}, headers:authHeader()})
  }
}
const noticeService = new NoticeService()
export default noticeService