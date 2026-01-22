import { useState, useRef } from 'react';
import './Chatbot.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: '안녕하세욥' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0 });

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { type: 'user', text: input }]);
    setInput('');
    
    // 봇 응답 시뮬레이션
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: '메시지답변답변답변답변' 
      }]);
    }, 1500);
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.chat-header')) {
      setIsDragging(true);
      dragRef.current = {
        startX: e.clientX - position.x,
        startY: e.clientY - position.y
      };
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragRef.current.startX,
      y: e.clientY - dragRef.current.startY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      <button 
        className="chatbot-trigger"
        onClick={() => setIsOpen(true)}
      >
        <img src="/images/landing/cat-eye-open.svg" alt="" className="trigger-cat open" />
        <img src="/images/landing/cat-eye-closed.svg" alt="" className="trigger-cat closed" />
      </button>

      {/* 챗봇 창 */}
      {isOpen && (
        <div 
          className={`chatbot-window ${isDragging ? 'dragging' : ''}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="chat-header">
            <h3>CashTalk</h3>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              X
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.type}`}>
                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="메시지를 입력하세요..."
            />
            <button onClick={handleSend}>
              전송
            </button>
          </div>
        </div>
      )}
    </>
  );
}