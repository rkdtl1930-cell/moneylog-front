import { useState, useRef } from 'react';
import './Chatbot.css';
import chatService from '../../services/chat.service';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: '안녕하세요! 무엇이 필요하신가요?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0 });
  

  const examplePrompts = [
    '오늘 점심에 마라탕 13000원 먹었어.',
    '이번 주 지출내역 확인해줘',
    '지난 달 소비가 제일 많았던 카테고리는 뭐야?',
  ];
  const PROMPTS_HIDDEN_KEY = 'chatbot_prompts_hidden';

  const [showPrompts, setShowPrompts] = useState(() => {
    return localStorage.getItem(PROMPTS_HIDDEN_KEY) !== '1';
  });


  // 예시 버튼
  const handlePromptClick = (text) => {
    setInput(text);

  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (showPrompts) {
      localStorage.setItem(PROMPTS_HIDDEN_KEY, '1');
      setShowPrompts(false);
    }
    
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
            <h3>TALKPAY</h3>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              X
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.type}`}>
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

          {/* ✅ 예시 문구 칩 */}
          {showPrompts && (
          <div className="prompt-chips">
            {examplePrompts.map((text, idx) => (
              <button
                key={idx}
                type="button"
                className="prompt-chip"
                onClick={() => handlePromptClick(text)}
              >
                {text}
              </button>
            ))}
          </div>
          )}  

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