import React, { useState, useEffect } from 'react';
import useUserStore from '../../../store/useUserStore';
import transactionService from '../../../services/transaction.service';
import { TransactionType } from '../../../models/TransactionType';
import './Content.css'
import Popup from '../popup/Popup';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  LabelList,
  Cell
} from "recharts";
import useBudgetStore from '../../../store/monthlyExpense ';


const Dashboard = () => {
  const [viewMode, setViewMode] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState([]);
  const [weekData, setWeekData] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, byCategory: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ date: '', amount: '', memo: '' });
  const [type, setType] = useState(TransactionType.INCOME);
  const [category, setCategory] = useState('');

  const incomeCategories = ["월급", "용돈", "부수입", "기타"];
  const expenseCategories = ["외식", "배달", "교통", "쇼핑", "생활", "기타"];
  const categoryColors = ["#4C7BED", "#5755BA", "#FB5D76", "#0296FC", "#9E76D9", "#94A5D1"]
  const currentUser = useUserStore((state) => state.user);
  const mid = currentUser?.id;

  const categoryIconMap = {
    외식: "/images/dashboard/category/food.png",
    배달: "/images/dashboard/category/delivery.png",
    교통: "/images/dashboard/category/vehicles.png",
    쇼핑: "/images/dashboard/category/shopping.png",
    월급: "/images/dashboard/category/money.png",
    기타: "/images/dashboard/category/ellipsis.png",
  };

  const setMonthlyExpense = useBudgetStore(state => state.setMonthlyExpense);
  useEffect(() => {
  setMonthlyExpense(summary.expense);
}, [summary.expense]);


  useEffect(() => {
    generateWeekDates(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (!mid) return;
    if (viewMode === 'daily') {
      loadWeekData(selectedDate);
      loadDailyData(selectedDate);
    } else {
      loadMonthlyData(selectedDate);
    }
  }, [viewMode, selectedDate, mid]);

  const generateWeekDates = (centerDate) => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(centerDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    setWeekDates(dates);
  };

  const loadWeekData = async (centerDate) => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(centerDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }

    const dataPromises = dates.map(async (date) => {
      try {
        const dateStr = formatDate(date);
        const response = await transactionService.getListByDay(mid, dateStr, 1, 100);
        const transactionList = response.data.dtoList || [];
        const income = transactionList.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
        const expense = transactionList.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
        return { date: dateStr, income, expense };
      } catch {
        return { date: formatDate(date), income: 0, expense: 0 };
      }
    });

    const results = await Promise.all(dataPromises);
    const weekDataObj = {};
    results.forEach(item => {
      weekDataObj[item.date] = { income: item.income, expense: item.expense };
    });
    setWeekData(weekDataObj);
  };

  const loadDailyData = async (date) => {
    try {
      setLoading(true);
      setError(null);
      const dateStr = formatDate(date);
      const response = await transactionService.getListByDay(mid, dateStr, 1, 100);
      const transactionList = response.data.dtoList || [];
      const income = transactionList.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
      const expense = transactionList.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
      const byCategory = transactionList.filter(t => t.type === 'EXPENSE').reduce((acc, t) => {
        const category = t.category || '기타';
        acc[category] = (acc[category] || 0) + t.amount;
        return acc;
      }, {});
      setTransactions(transactionList);
      setSummary({ income, expense, byCategory });
    } catch {
      setError('데이터를 불러오는데 실패했습니다.');
      setTransactions([]);
      setSummary({ income: 0, expense: 0, byCategory: {} });
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyData = async (date) => {
    try {
      setLoading(true);
      setError(null);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const monthStr = `${year}-${month}`;
      const response = await transactionService.getListByMonth(mid, monthStr, 1, 1000);
      const transactionList = response.data.dtoList || [];
      const income = transactionList.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
      const expense = transactionList.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
      const byCategory = transactionList.filter(t => t.type === 'EXPENSE').reduce((acc, t) => {
        const category = t.category || '기타';
        acc[category] = (acc[category] || 0) + t.amount;
        return acc;
      }, {});
      setTransactions(transactionList);
      setSummary({ income, expense, byCategory });
    } catch {
      setError('데이터를 불러오는데 실패했습니다.');
      setTransactions([]);
      setSummary({ income: 0, expense: 0, byCategory: {} });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      alert("카테고리를 선택해주세요!");
      return;
    }
    try {
      const payload = { mid: currentUser.id, type, category, date: newTransaction.date, amount: parseInt(newTransaction.amount), memo: newTransaction.memo };
      await transactionService.register(payload);
      alert("등록이 완료되었습니다!");
      setShowModal(false);
      setNewTransaction({ date: '', amount: '', memo: '' });
      setType(TransactionType.INCOME);
      setCategory('');
      if (viewMode === 'daily') {
        loadWeekData(selectedDate);
        loadDailyData(selectedDate);
      } else {
        loadMonthlyData(selectedDate);
      }
    } catch {
      alert("등록에 실패했습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (transactionType) => {
    setNewTransaction({ date: formatDate(selectedDate), amount: '', memo: '' });
    setType(transactionType);
    setCategory('');
    setShowModal(true);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  const formatCompactCurrency = (amount) => {
    if (amount >= 100000000) {
      return (amount / 100000000).toFixed(1) + '억';
    }
    if (amount >= 10000) {
      return (amount / 10000).toFixed(1).replace('.0', '') + '만';
    }
    return amount.toLocaleString();
  };

  const changeWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setSelectedDate(newDate);
  };

  const changeMonth = (months) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + months);
    setSelectedDate(newDate);
  };

  const getMonthYear = () => {
    return `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월`;
  };

  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  return (
    <>
      <h1>Dashboard</h1>
      <div className="dash-board-con">
        <div className="period-wrap">
          <div>
            <button onClick={() => setViewMode('daily')} className={`${viewMode === 'daily' ? 'on' : ''}`}>일간뷰</button>
            <button onClick={() => setViewMode('monthly')} className={`${viewMode === 'monthly' ? 'on' : ''}`}>월간뷰</button>
          </div>
          <div>
            <button onClick={() => openModal(TransactionType.INCOME)}>수입 등록</button>
            <button onClick={() => openModal(TransactionType.EXPENSE)}>지출 등록</button>
          </div>
        </div>

        {/* 일간뷰 시작 */}
        {viewMode === 'daily' && (
          <>
            <div className="card">
              <div className="date-navi">
                <h2 >{getMonthYear()}</h2>
                <div>
                  <button onClick={() => changeWeek(-1)} disabled={loading}>
                    <img src="/images/dashboard/cal-left.svg" alt="" />
                  </button>
                  <button onClick={() => changeWeek(1)} disabled={loading}>
                    <img src="/images/dashboard/cal-right.svg" alt="" />
                  </button>
                </div>
              </div>
              <div className="grid week">
                {weekDates.map((date, idx) => {
                  const isSelected = isSameDay(date, selectedDate);
                  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
                  const isSun = date.getDay() === 0;
                  const isSat = date.getDay() === 6;
                  const dateStr = formatDate(date);
                  const dayData = weekData[dateStr] || { income: 0, expense: 0 };
                  return (
                    <button key={idx} onClick={() => setSelectedDate(date)} disabled={loading} className={`${isSelected ? 'selected' : isToday(date) ? 'today' : ''}`}>
                      <div className={`day ${isSelected ? 'text-white' : isSun ? 'text-red-500' : isSat ? 'text-blue-500' : 'text-gray-500'}`}>{dayOfWeek}</div>
                      <div className={`number ${isSelected ? 'text-white' : isToday(date) ? 'text-blue-600' : 'text-gray-800'}`}>
                        <p>{date.getDate()}</p>
                      </div>
                      {(dayData.income > 0 || dayData.expense > 0) && (
                        <div className="amount-info">
                          {dayData.income > 0 && <span className="income">+{formatCompactCurrency(dayData.income)}</span>}
                          {dayData.expense > 0 && <span className="expense">-{formatCompactCurrency(dayData.expense)}</span>}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            {loading && <div className="loading-wrap"><div className="spinner"></div><p>데이터를 불러오는 중...</p></div>}
            {error && <div className="error-wrap"><p>{error}</p></div>}
            {!loading && (
              <>
                <div className="total-box">
                  <div className='card'>
                    <h5 className="">총 수입</h5>
                    <p className="">{formatCurrency(summary.income)}</p>
                  </div>
                  <div className='card'>
                    <h5 className="">총 지출</h5>
                    <p className="">{formatCurrency(summary.expense)}</p>
                  </div>
                </div>
                <div className="history-box">
                  <div className='card'>
                    <h5>거래내역</h5>
                    {transactions.length === 0 ? (
                      <p className="no-data">거래 내역이 없습니다</p>
                    ) : (
                      <>
                        <table className="common-table">
                          <thead>
                            <tr>
                              <th>날짜</th>
                              <th>카테고리</th>
                              <th>수입/지출</th>
                              <th>금액</th>
                              <th>메모</th>
                            </tr>
                          </thead>

                          <tbody>
                            {transactions.map((t) => (
                              <tr key={t.id}>
                                <td>{t.date}</td>
                                <td>{t.category || "기타"}</td>
                                <td className={t.type === "INCOME" ? "income" : "expense"}>
                                  <span>{t.type === "INCOME" ? "수입" : "지출"}</span>
                                </td>
                                <td className={t.type === "INCOME" ? "income" : "expense"}>
                                  {t.amount.toLocaleString()}원
                                </td>
                                <td>{t.memo || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {/* 일간뷰 끝 */}

        {/* 월간뷰 시작 */}
        {viewMode === "monthly" && (
          <>
            <div className="card">
              <div className="date-navi">
                <h2>{getMonthYear()}</h2>
                <div>
                  <button onClick={() => changeMonth(-1)} disabled={loading}>
                    <img src="/images/dashboard/cal-left.svg" alt="" />
                  </button>
                  <button onClick={() => changeMonth(1)} disabled={loading}>
                    <img src="/images/dashboard/cal-right.svg" alt="" />
                  </button>
                </div>
              </div>
            </div>

            {/* 요약 카드 */}
            <div className="total-box">
              <div className="card">
                <h5>총 수입</h5>
                <p className="income">{formatCurrency(summary.income)}</p>
              </div>
              <div className="card">
                <h5>총 지출</h5>
                <p className="expense">{formatCurrency(summary.expense)}</p>
              </div>
              <div className="card">
                <h5>잔액</h5>
                <p className={summary.income - summary.expense >= 0 ? "income" : "expense"}>
                  {formatCurrency(summary.income - summary.expense)}
                </p>
              </div>
            </div>
            <h5 className='sub-title'>소비분석</h5>
            <div className="category-box">
              {Object.keys(summary.byCategory).length === 0 ? (
                <p className="no-data">지출 내역이 없습니다</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={20}>
                    <BarChart
                      data={[
                        Object.entries(summary.byCategory)
                          .sort((a, b) => b[1] - a[1])
                          .reduce((acc, [name, value]) => {
                            acc[name] = value;
                            return acc;
                          }, {})
                      ]}
                      layout="vertical"
                    >
                      <XAxis type="number" hide />
                      <YAxis type="category" hide />
                      {Object.entries(summary.byCategory)
                        .sort((a, b) => b[1] - a[1])
                        .map(([category], i) => (
                          <Bar
                            key={category}
                            dataKey={category}
                            stackId="a"
                            fill={categoryColors[i % 6]}
                            radius={i === 0 ? [0, 0, 0, 0] : i === Object.keys(summary.byCategory).length - 1 ? [0, 0, 0, 0] : [0, 0, 0, 0]}
                          >
                            <LabelList
                              dataKey={category}
                              position="center"
                              content={({ value, x, y, width }) => {
                                if (!value) return null;
                                const percentage = ((value / summary.expense) * 100).toFixed(1);
                                if (width < 50) return null;
                                return (
                                  <text
                                    x={x + width / 2}
                                    y={y + 30}
                                    fill="white"
                                    textAnchor="middle"
                                    fontSize="14"
                                    fontWeight="bold"
                                  >
                                    {category} {percentage}%
                                  </text>
                                );
                              }}
                            />
                          </Bar>
                        ))}
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="category-legend">
                    {Object.entries(summary.byCategory)
                      .sort((a, b) => b[1] - a[1])
                      .map(([category, amount], i) => {
                        const percentage = ((amount / summary.expense) * 100).toFixed(1);
                        const color = categoryColors[i % 6];
                        return (
                          <div key={category} className="legend-item">
                            <span
                              className="legend-color"
                              style={{ backgroundColor: color }}
                            />
                            <span className="legend-text">
                              {category} {percentage}%
                            </span>
                          </div>
                        );
                      })}
                  </div>
                  <ul className="category-list">
                    {Object.entries(summary.byCategory)
                      .slice(0, 3)
                      .sort((a, b) => b[1] - a[1])
                      .map(([category, amount]) => (
                        <li key={category} className="category-item card">
                          <h5>{category}</h5>
                          <span>
                            <img
                              src={categoryIconMap[category] || categoryIconMap["기타"]}
                              alt={category}
                              className="category-icon"
                            />
                          </span>
                          <strong className="expense">
                            {formatCurrency(amount)}
                          </strong>
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </div>
            {/* 그래프 영역 */}
            <h5 className='sub-title'>통계</h5>
            <div className="graph-box">
              {/* 수입 vs 지출 */}
              <div className="card">
                <h5>수입 / 지출 비교</h5>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={[
                      { name: "수입", amount: summary.income },
                      { name: "지출", amount: summary.expense },
                    ]}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 18, fontWeight: '600', fill: '#374151' }}  // 색상도 변경 가능
                    />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                      <Cell fill="#6585F6" />  {/* 수입 - 초록색 */}
                      <Cell fill="#F765A3" />  {/* 지출 - 빨간색 */}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* 일자별 지출 추이 */}
              <div className="card mt-4">
                <h5>일자별 지출 추이</h5>

                <ResponsiveContainer width="100%" height={260}>
                  <LineChart
                    data={Object.entries(
                      transactions.reduce((acc, t) => {
                        if (t.type === "EXPENSE") {
                          const day = t.date.slice(8, 10);
                          acc[day] = (acc[day] || 0) + t.amount;
                        }
                        return acc;
                      }, {})
                    )
                      .map(([day, amount]) => ({ day, amount }))
                      .sort((a, b) => a.day - b.day)}
                  >
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#6585F6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
        {/* 월간뷰 끝 */}
      </div>

      {/* 팝업 */}
      <Popup open={showModal} onClose={() => setShowModal(false)}>
        <div className="popup-header">
          <h3>
            {type === TransactionType.INCOME ? "수입 등록" : "지출 등록"}
          </h3>
          <button className="close-btn" onClick={() => setShowModal(false)}>
            <img src="/images/dashboard/ico-close.svg" alt="" />
          </button>
        </div>

        <div className="popup-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>날짜</label>
              <input
                type="date"
                name="date"
                value={newTransaction.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">카테고리 선택</option>
                {(type === TransactionType.INCOME ? incomeCategories : expenseCategories).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>금액</label>
              <input
                type="number"
                name="amount"
                value={newTransaction.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>메모</label>
              <textarea
                name="memo"
                value={newTransaction.memo}
                onChange={handleChange}
              />
            </div>

            <div className="popup-footer">
              <button
                type="button"
                className="btn close"
                onClick={() => setShowModal(false)}
              >
                취소
              </button>
              <button type="submit" className="btn primary">
                등록
              </button>
            </div>
          </form>
        </div>
      </Popup>
    </>
  );
};

export default Dashboard;