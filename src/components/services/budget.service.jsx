import axios from "axios";
import { BASE_API_URL } from "../common/constants";
import { authHeader } from "./base.service";

const BASE_URL = BASE_API_URL+"/api/budget"

class BudgetService {
  getMonthlyBudget(mid, defaultLimit){
    return axios.get(`${BASE_URL}/current/${mid}?defaultLimit=${defaultLimit}`,{headers:authHeader()})
  }

   addExpense(mid, amount, defaultLimit){
    return axios.post(`${BASE_URL}/expense/${mid}?amount=${amount}&defaultLimit=${defaultLimit}`,{},{headers:authHeader()})
   } 
   updateLimit(mid, newLimit){
    return axios.put(`${BASE_URL}/limit/${mid}?newLimit=${newLimit}`,{},{headers:authHeader()})
   }
   getBudgets(mid, page, size){
    return axios.get(`${BASE_URL}/list/${mid}?page=${page}&size=${size}`,{headers:authHeader()})
   }
   createBudget(budget){
    return axios.post(`${BASE_URL}`,budget,{headers:authHeader()})
   }
}
const budgetService = new BudgetService()
export default budgetService