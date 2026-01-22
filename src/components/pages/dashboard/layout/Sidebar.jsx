import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Form, Modal } from "react-bootstrap";
import logo from "../../../../assets/cashtalk.svg";
import useUserStore from "../../../store/useUserStore";
import budgetService from "../../../services/budget.service";
import Popup from '../popup/Popup';
import useBudgetStore from '../../../store/monthlyExpense ';

export default function Sidebar() {
  const currentUser = useUserStore((state) => state.user);
  const mid = currentUser?.id;
  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'ROLE_ADMIN';

  // 기본 메뉴
  const baseMenuItems = [
    { path: '/dashboard/main', iconOff: '/images/dashboard/icons/home-off.svg', iconOn: '/images/dashboard/icons/home-on.svg', label: '대시보드', end: true },
    { path: '/dashboard/expense', iconOff: '/images/dashboard/icons/expense-off.svg', iconOn: '/images/dashboard/icons/expense-on.svg', label: '지출 내역' },
    { path: '/dashboard/setting', iconOff: '/images/dashboard/icons/setting-off.svg', iconOn: '/images/dashboard/icons/setting-on.svg', label: '설정' },
  ];

  // 관리자 전용 메뉴
  const adminMenuItems = [
    { path: '/dashboard/admin', iconOff: '/images/dashboard/icons/setting-off.svg', iconOn: '/images/dashboard/icons/setting-on.svg', label: '회원 관리' },
  ];

  // role이 ADMIN이면 관리자 메뉴 추가
  const menuItems = currentUser?.role === 'ADMIN' 
    ? adminMenuItems
    : baseMenuItems;

  const [budgets, setBudgets] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [newLimit, setNewLimit] = useState("");

  // 현재 날짜
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;


  // 이번달 사용금액
  const monthlyExpense = useBudgetStore(state => state.monthlyExpense);

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
    ? ((monthlyExpense / currentBudget.limitAmount) * 100).toFixed(1)
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
      {!isAdmin && (
        <div className="balance-wrap">
          <div className="balance-header">
            <p className="month">{currentMonth}월 지출금액</p>
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
                  <span className="value">{monthlyExpense.toLocaleString()}</span>원
                </div>
              </>
            ) : (
              // 한도 설정 없을시
              <>
                <p className="empty-text">
                  {currentMonth}월의 한도가 설정되지 않았어요.<br />
                  한도를 설정해주세요.
                </p>
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
                    width: `${Math.min(usedRate, 100)}%`, height: '100%',
                    backgroundColor: usedRate > 50 ? "#f75b50" : "#157AFF"
                  }}
                />
              </div>
              <div className="progress-text">
                {monthlyExpense.toLocaleString()} /{" "}
                {currentBudget.limitAmount.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}

      <Popup open={showEdit} onClose={closeEdit}>
        <div className="popup-header">
          <h3>예산 설정</h3>
          <button className="close-btn" onClick={closeEdit}><img src="/images/dashboard/ico-close.svg" alt="" /></button>
        </div>

        <div className="popup-body">
          <div className='form-group'>
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