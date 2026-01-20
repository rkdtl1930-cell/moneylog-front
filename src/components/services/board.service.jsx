import axios from "axios";
import { BASE_API_URL } from "../common/constants";
import { authHeader } from "./base.service";

const BASE_URL = BASE_API_URL + "/api/boards";

class BoardService {
  createBoard(board) {
    return axios.post(BASE_URL, board, { headers: authHeader() });
  }

  getBoard(id) {
    return axios.get(`${BASE_URL}/${id}`, { headers: authHeader() });
  }

  updateBoard(id, board) {
    return axios.put(`${BASE_URL}/${id}`, board, { headers: authHeader() });
  }

  deleteBoard(id) {
    return axios.delete(`${BASE_URL}/${id}`, { headers: authHeader() });
  }

  getBoards(page, size) {
  return axios.get(`${BASE_URL}/list`, { params: { page, size }, headers: authHeader() });
  }
}

const boardService = new BoardService();
export default boardService;
