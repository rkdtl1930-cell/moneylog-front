import { Outlet } from 'react-router-dom';
import './Layout.css'
import Sidebar from './Sidebar';
import { useState } from 'react';
import Chatbar from './Chatbar';

export default function DashboardLayout() {
  const [isChatbarOpen, setIsChatbarOpen] = useState(true);
  return (
    <div className={`dashboard-layout ${isChatbarOpen ? 'chat-open' : 'chat-closed'}`}>
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
      <Chatbar isOpen={isChatbarOpen} onToggle={() => setIsChatbarOpen(!isChatbarOpen)} />
    </div>
  );
}