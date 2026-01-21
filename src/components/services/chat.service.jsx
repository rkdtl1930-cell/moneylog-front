import axios from "axios";
import { BASE_API_URL } from "../common/constants";
import { authHeader } from "./base.service";

const BASE_URL = BASE_API_URL + "/api/chat";

class ChatService {
  sendMessage(message) {
    return axios.post(
      BASE_URL,
      { message },
      { headers: authHeader() }
    );
  }
}

const chatService = new ChatService();
export default chatService;
