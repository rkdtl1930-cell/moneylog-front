import { Outlet } from 'react-router-dom';
import './Layout.css'
import Sidebar from './Sidebar';
import { useState } from 'react';
import Chatbar from './Chatbar';
// import useUserStore from '../../../store/useUserStore';

export default function DashboardLayout() {
  const [isChatbarOpen, setIsChatbarOpen] = useState(true);
  // const currentUser = useUserStore((state) => state.user);

  // 사용자 유형에 따른 텍스트
  // const getUserTypeText = (interesting) => {
  //   switch (interesting) {
  //     case 'record':
  //       return '기록형';
  //     case 'goal':
  //       return '목표형';
  //     default:
  //       return '기록형';
  //   }
  // };

  return (
    <div className={`dashboard-layout ${isChatbarOpen ? 'chat-open' : 'chat-closed'}`}>
      <Sidebar />
      <main className="main-content">
        {/* <div className="info">
          {currentUser && (
            <p className="welcome-message">
              안녕하세요, {currentUser.name || currentUser.nickname}님 ({getUserTypeText(currentUser.interesting)})
            </p>
          )}
        </div> */}
        <Outlet />
      </main>
      <Chatbar isOpen={isChatbarOpen} onToggle={() => setIsChatbarOpen(!isChatbarOpen)} />
    </div>
  );
}