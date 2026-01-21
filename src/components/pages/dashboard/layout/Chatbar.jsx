import { useState } from 'react';
import './Chatbar.css';
import chatService from '../../../services/chat.service';

export default function Chatbar({ isOpen, onToggle }) {

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: '안녕하세요! 오늘 지출을 말씀해주세요' }
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // 봇이 응답 중임을 표시
    setIsTyping(true);

    try {
      const res = await chatService.sendMessage(input);

      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: res.data.reply, 
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 2, type: 'bot', text: '에러가 발생' }
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
              src={isOpen ? '/images/dashboard/arrow-right.svg' : '/images/dashboard/arrow-left.svg'} 
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
          {/* 타이핑 인디케이터 */}
          {isTyping && (
            <div className="msg bot">
              <div className="typing-indicator">
                <div className="cat-thinking">
                  <img src="/images/landing/cat-eye-open.svg" alt="" className="cat-eye open" />
                  <img src="/images/landing/cat-eye-closed.svg" alt="" className="cat-eye closed" />
                </div>
                <div className="dots">
                  <span></span>
                  <span></span>
                  <span></span>
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
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>
            <img src="/images/dashboard/icons/send.svg" alt="" />
          </button>
        </div>
      </div>
    </aside>
  );
}