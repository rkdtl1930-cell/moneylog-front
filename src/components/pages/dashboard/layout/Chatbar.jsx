import { useState } from 'react';
import './Chatbar.css';

export default function Chatbar({ isOpen, onToggle }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: '안녕하세요! 오늘 지출을 말씀해주세요' }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    // 사용자 메시지 추가
    const newMsg = { id: Date.now(), type: 'user', text: input };
    setMessages([...messages, newMsg]);

    // 봇 응답 (시뮬레이션)
    setTimeout(() => {
      const botMsg = { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: '기록했어요! 식비 12,000원으로 분류했습니다.' 
      };
      setMessages(prev => [...prev, botMsg]);
    }, 500);

    setInput('');
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