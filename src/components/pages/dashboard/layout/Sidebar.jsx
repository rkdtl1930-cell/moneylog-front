import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Form, Modal } from "react-bootstrap";
import logo from "../../../../assets/cashtalk.svg";
import useUserStore from "../../../store/useUserStore";
import budgetService from "../../../services/budget.service";
import Popup from '../popup/Popup';

export default function Sidebar() {
  //메뉴
  const menuItems = [
    { path: '/dashboard/main', iconOff: '/images/dashboard/icons/home-off.svg', iconOn: '/images/dashboard/icons/home-on.svg', label: '대시보드', end: true },
    { path: '/dashboard/expense', iconOff: '/images/dashboard/icons/expense-off.svg', iconOn: '/images/dashboard/icons/expense-on.svg', label: '지출 내역' },
    { path: '/dashboard/statistics', iconOff: '/images/dashboard/icons/statistics-off.svg', iconOn: '/images/dashboard/icons/statistics-on.svg', label: '통계' },
    { path: '/dashboard/setting', iconOff: '/images/dashboard/icons/setting-off.svg', iconOn: '/images/dashboard/icons/setting-on.svg', label: '설정' },
  ];

  const currentUser = useUserStore((state) => state.user);
  const mid = currentUser?.id;

  const [budgets, setBudgets] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [newLimit, setNewLimit] = useState("");

  // 현재 날짜
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;



  // 예산 가져오기
  const fetchBudget = async () => {
    if (!mid) return;
    try {
      const res = await budgetService.getBudgets(mid, 1, 12);
      setBudgets(res.data.dtoList || []);
    } catch (err) {
      console.log(err);
      setBudgets([]);
    }
  };

  useEffect(() => {
    if (!mid) return;

    const fetchBudget = async () => {
      try {
        const res = await budgetService.getBudgets(mid, 1, 12);
        setBudgets(res.data.dtoList || []);
      } catch (err) {
        console.log(err);
        setBudgets([]);
      }
    };

    fetchBudget();
  }, [mid]);



  // 이번 달 예산 찾기
  const currentBudget = budgets.find(
    (b) => b.year === currentYear && b.month === currentMonth
  );
  const openEdit = (budget) => {
    setEditingBudget(budget);
    setNewLimit(budget.limitAmount);
    setShowEdit(true);
  };

  const closeEdit = () => setShowEdit(false);

  const handleOpenBudget = () => {
    const budget = currentBudget || {
      id: null,
      mid: mid,
      year: currentYear,
      month: currentMonth,
      limitAmount: 0,
      usedAmount: 0
    };
    openEdit(budget);
  };

  const handleSave = async () => {
    try {
      if (editingBudget.id) {
        await budgetService.updateLimit(mid, newLimit);
      } else {
        await budgetService.createBudget({
          mid: mid,
          year: editingBudget.year,
          month: editingBudget.month,
          limitAmount: newLimit
        });
      }
      fetchBudget();
      closeEdit();
    } catch (err) {
      console.log(err);
    }
  };

  // 남은 금액 및 사용률 계산
  const usedRate = currentBudget
    ? ((currentBudget.usedAmount / currentBudget.limitAmount) * 100).toFixed(1)
    : 0;

  return (
    <aside className="sidebar">
      <div className="con">
        <div className="logo">
          <h1><img src={logo} alt="" /></h1>
        </div>

        <nav className="menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}
            >
              {({ isActive }) => (
                <>
                  <img src={isActive ? item.iconOn : item.iconOff} alt="" />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 예산 현황 */}
      <div className="balance-wrap">
        <div className="balance-header">
          <p className="month">{currentMonth}월 한도</p>
          {currentBudget ? (
            <button className="btn-modify" onClick={handleOpenBudget}>
              한도수정
            </button>
          ) : (
            <button className="btn-set" onClick={handleOpenBudget}>
              한도설정
            </button>
          )}
        </div>

        <div className="balance-box">
          {currentBudget ? (
            // 한도 설정 있을 시
            <>
              <div className="amount">
                <span className="value">{currentBudget.usedAmount.toLocaleString()}</span>원
              </div>
              {/* <div className="amount-row">
                <span className="label">이번달 쓴 금액</span>
                <span className="value">{currentBudget.usedAmount.toLocaleString()}원</span>
              </div>
              <div className="amount-row">
                <span className="label">남은 금액</span>
                <span className={`value ${remainAmount < 0 ? 'minus' : ''}`}>
                  {remainAmount.toLocaleString()}원
                </span>
              </div> */}
            </>
          ) : (
            // 한도 설정 없을시
            <>
              <p className="empty-text">
                {currentMonth}월의 한도가 설정되지 않았어요.<br />
                한도를 설정해주세요.
              </p>
              <button className="btn-set" onClick={handleOpenBudget}>
                한도설정
              </button>
            </>
          )}
        </div>
        {/* 바 그래프 */}
       {currentBudget && (
          <div className="progress-wrap">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(usedRate, 100)}%`,
                  backgroundColor: usedRate > 100 ? "#ff4444" : "#FFD700"
                }}
              />
            </div>
            <div className="progress-text">
              {currentBudget.usedAmount.toLocaleString()} /{" "}
              {currentBudget.limitAmount.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      <Popup open={showEdit} onClose={closeEdit}>
        <div className="popup-header">
          <h3>예산 설정</h3>
          <button className="close-btn" onClick={closeEdit}>×</button>
        </div>

        <div className="popup-body">
          <div>
            <label>예산 금액</label>
            <input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
            />
          </div>
        </div>

        <div className="popup-footer">
          <button className="btn close" onClick={closeEdit}>
            닫기
          </button>
          <button className="btn primary" onClick={handleSave}>
            저장
          </button>
        </div>
      </Popup>

    </aside>
  );
}