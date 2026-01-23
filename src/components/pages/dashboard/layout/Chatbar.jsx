import { useState } from 'react';
import './Chatbar.css';
import chatService from '../../../services/chat.service';
import useTransactionStore from '../../../store/useTransactionStore';

export default function Chatbar({ isOpen, onToggle }) {

  // ✅ Zustand 훅은 컴포넌트 최상단
  const triggerRefresh = useTransactionStore(
    (state) => state.triggerRefresh
  );

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: '안녕하세요! 오늘 지출을 말씀해주세요' }
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;

    // 유저 메시지 먼저 추가
    setMessages(prev => [
      ...prev,
      { id: Date.now(), type: 'user', text: userText }
    ]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await chatService.sendMessage(userText);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          text: res.data.reply,
        }
      ]);

      // db 저장 성공 시 대시보드 리프레시
      triggerRefresh();

    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 2, type: 'bot', text: '에러가 발생했습니다.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <aside className={`chatbar ${isOpen ? 'open' : 'closed'}`}>
      <div className="chat-inner">
        <div className="chat-header">
          <h3>Chat</h3>
          <button className="toggle-btn" onClick={onToggle}>
            <img
              src={
                isOpen
                  ? '/images/dashboard/arrow-right.svg'
                  : '/images/dashboard/arrow-left.svg'
              }
              alt=""
            />
          </button>
        </div>

        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`msg ${msg.type}`}>
              {msg.text}
            </div>
          ))}

          {isTyping && (
            <div className="msg bot">
              <div className="typing-indicator">
                <div className="cat-thinking">
                  <img
                    src="/images/landing/cat-eye-open.svg"
                    alt=""
                    className="cat-eye open"
                  />
                  <img
                    src="/images/landing/cat-eye-closed.svg"
                    alt=""
                    className="cat-eye closed"
                  />
                </div>
                <div className="dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Text Here .."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>
            <img src="/images/dashboard/icons/send.svg" alt="" />
          </button>
        </div>
      </div>
    </aside>
  );
}
