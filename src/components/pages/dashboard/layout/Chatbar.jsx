import { useState } from 'react';
import './Chatbar.css';
import chatService from '../../../services/chat.service';
import useTransactionStore from '../../../store/useTransactionStore';

export default function Chatbar({ isOpen, onToggle }) {
  const triggerRefresh = useTransactionStore(
    (state) => state.triggerRefresh
  );

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: '안녕하세요! 오늘 지출을 말씀해주세요' }
  ]);
  const examplePrompts = [
    '오늘 점심에 마라탕 13000원 먹었어.',
    '이번 주 지출내역 확인해줘',
    '지난 달 소비가 제일 많았던 카테고리는 뭐야?',
  ];

  const PROMPTS_HIDDEN_KEY = 'chatbar_prompts_hidden';

  const [showPrompts, setShowPrompts] = useState(() => {
    return localStorage.getItem(PROMPTS_HIDDEN_KEY) !== '1';
  });  

  const handlePromptClick = (text) => {
    setInput(text);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

        // 예시 문구 영구 숨김
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
        {/* 예시 문구 칩*/}
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
