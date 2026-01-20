import axios from "axios";
import { BASE_API_URL } from "../common/constants";
import { authHeader } from "./base.service";

const BASE_URL = BASE_API_URL+"/api/transactions"

class TransactionService{
  register(transaction){
    return axios.post(BASE_URL, transaction, {headers:authHeader()})
  }
  get(id){
    return axios.get(`${BASE_URL}/${id}`,{headers:authHeader()})
  }
  getList(mid, page,size){
    return axios.get(`${BASE_URL}/member/${mid}`,{headers:authHeader(),params:{page,size}})
  }
  getListByDate(mid, date, page, size){
    return axios.get(`${BASE_URL}/member/${mid}/date`,{headers:authHeader(),params:{date,page,size}})
  }
  getListByPeriod(mid, start, end, page, size){
    return axios.get(`${BASE_URL}/member/${mid}/period`,{headers:authHeader(),params:{start,end,page,size}})
  }
  modify(transaction){
    return axios.put(BASE_URL,transaction,{headers:authHeader()})
  }
  delete(id){
    return axios.delete(`${BASE_URL}/${id}`,{headers:authHeader()})
  }
  getListByMonth(mid, month, page, size){
    const params = {page, size}
    if(month) params.month = month
    return axios.get(`${BASE_URL}/member/${mid}/month`,{headers:authHeader(),params})
  }
  getListByDay(mid, date, page, size){  
    const params = {page, size, date}
    if(date) params.date = date  
    return axios.get(`${BASE_URL}/member/${mid}/day`,{headers:authHeader(),params})
  }
}
const transactionService = new TransactionService()
export default transactionService