import React, { useState, useEffect } from 'react';
import useUserStore from '../../../store/useUserStore';
import transactionService from '../../../services/transaction.service';
import { TransactionType } from '../../../models/TransactionType';

const Dashboard = () => {
  const [viewMode, setViewMode] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, byCategory: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 모달 관련 state
  const [showModal, setShowModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    amount: '',
    memo: ''
  });
  const [type, setType] = useState(TransactionType.INCOME);
  const [category, setCategory] = useState('');

  const categories = ["외식", "배달", "교통", "쇼핑", "월급", "기타"];
  const currentUser = useUserStore((state) => state.user);
  const mid = currentUser?.id;

  useEffect(() => {
    if (!mid) return; // mid 없으면 실행 안 함

    if (viewMode === 'daily') {
      loadDailyData(selectedDate);
    } else {
      loadMonthlyData(selectedDate);
    }
  }, [viewMode, selectedDate, mid]);

  const loadDailyData = async (date) => {
    try {
      setLoading(true);
      setError(null);

      const dateStr = formatDate(date);
      const response = await transactionService.getListByDay(
        mid,
        dateStr,
        0,
        100
      );

      const transactionList = response.data.dtoList || [];

      const income = transactionList
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = transactionList
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

      const byCategory = transactionList
        .filter(t => t.type === 'EXPENSE')
        .reduce((acc, t) => {
          const category = t.category || '기타';
          acc[category] = (acc[category] || 0) + t.amount;
          return acc;
        }, {});

      setTransactions(transactionList);
      setSummary({ income, expense, byCategory });

    } catch (err) {
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

      const response = await transactionService.getListByMonth(mid, null, 0, 1000, monthStr);

      const transactionList = response.data.dtoList || [];

      const income = transactionList
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = transactionList
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

      const byCategory = transactionList
        .filter(t => t.type === 'EXPENSE')
        .reduce((acc, t) => {
          const category = t.category || '기타';
          acc[category] = (acc[category] || 0) + t.amount;
          return acc;
        }, {});

      setTransactions(transactionList);
      setSummary({ income, expense, byCategory });

    } catch (err) {
      console.error('월간 데이터 로딩 실패:', err);
      setError('데이터를 불러오는데 실패했습니다.');
      setTransactions([]);
      setSummary({ income: 0, expense: 0, byCategory: {} });
    } finally {
      setLoading(false);
    }
  };

  // 거래 등록
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      alert("카테고리를 선택해주세요!");
      return;
    }

    try {
      const payload = {
        mid: currentUser.id,
        type,
        category,
        date: newTransaction.date,
        amount: parseInt(newTransaction.amount),
        memo: newTransaction.memo
      };

      await transactionService.register(payload);
      alert("등록이 완료되었습니다!");

      // 모달 닫고 초기화
      setShowModal(false);
      setNewTransaction({ date: '', amount: '', memo: '' });
      setType(TransactionType.INCOME);
      setCategory('');

      // 데이터 새로고침
      if (viewMode === 'daily') {
        loadDailyData(selectedDate);
      } else {
        loadMonthlyData(selectedDate);
      }

    } catch (err) {
      console.error(err);
      alert("등록에 실패했습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const openModal = (transactionType) => {
    // 현재 선택된 날짜로 기본값 설정
    setNewTransaction({
      date: formatDate(selectedDate),
      amount: '',
      memo: ''
    });
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

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
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

  const getCategoryPercentage = (amount) => {
    return summary.expense > 0 ? (amount / summary.expense * 100).toFixed(1) : 0;
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">
      
      <div className="max-w-4xl mx-auto">
        {/* 헤더 - 뷰 모드 전환 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('daily')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${viewMode === 'daily'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              일간뷰
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${viewMode === 'monthly'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              월간뷰
            </button>
          </div>
        </div>

        {/* 날짜 선택 + 등록 버튼 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => viewMode === 'daily' ? changeDate(-1) : changeMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg text-xl"
              disabled={loading}
            >
              ◀
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <span className="text-lg font-semibold">
                {viewMode === 'daily'
                  ? selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
                  : getMonthYear()
                }
              </span>
            </div>

            <button
              onClick={() => viewMode === 'daily' ? changeDate(1) : changeMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg text-xl"
              disabled={loading}
            >
              ▶
            </button>
          </div>

          {viewMode === 'daily' && (
            <div className="mt-3 flex gap-2">
              <input
                type="date"
                value={formatDate(selectedDate)}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="flex-1 p-2 border border-gray-300 rounded-lg"
                disabled={loading}
              />
              <button
                onClick={() => openModal(TransactionType.INCOME)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                💰 수입
              </button>
              <button
                onClick={() => openModal(TransactionType.EXPENSE)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
              >
                💸 지출
              </button>
            </div>
          )}

          {viewMode === 'monthly' && (
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => openModal(TransactionType.INCOME)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                💰 수입 등록
              </button>
              <button
                onClick={() => openModal(TransactionType.EXPENSE)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
              >
                💸 지출 등록
              </button>
            </div>
          )}
        </div>

        {/* 로딩/에러 상태 */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-4 text-center">
            <div className="text-gray-500">데이터를 불러오는 중...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 수입/지출 요약 */}
        {!loading && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📈</span>
                  <span className="text-sm text-gray-600">총 수입</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(summary.income)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📉</span>
                  <span className="text-sm text-gray-600">총 지출</span>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(summary.expense)}
                </p>
              </div>
            </div>

            {/* 카테고리별 지출 */}
            {Object.keys(summary.byCategory).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="font-semibold text-lg mb-4">카테고리별 지출</h3>
                <div className="space-y-3">
                  {Object.entries(summary.byCategory)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, amount]) => (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-sm font-semibold">{formatCurrency(amount)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${getCategoryPercentage(amount)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{getCategoryPercentage(amount)}%</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 거래 내역 테이블 (일간뷰만) */}
            {viewMode === 'daily' && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-lg">거래 내역</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {transactions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      거래 내역이 없습니다
                    </div>
                  ) : (
                    transactions.map((transaction) => (
                      <div key={transaction.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${transaction.type === 'INCOME'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-red-100 text-red-700'
                                }`}>
                                {transaction.category || '기타'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTime(transaction.date)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {transaction.memo || '내역 없음'}
                            </p>
                          </div>
                          <p className={`text-lg font-bold ${transaction.type === 'INCOME' ? 'text-blue-600' : 'text-red-600'
                            }`}>
                            {transaction.type === 'INCOME' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 월간 차트 (월간뷰) */}
            {viewMode === 'monthly' && Object.keys(summary.byCategory).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-lg mb-4">월간 지출 분석</h3>
                <div className="space-y-4">
                  {Object.entries(summary.byCategory)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, amount]) => (
                      <div key={category} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium">{category}</div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-8 relative">
                            <div
                              className="bg-gradient-to-r from-blue-400 to-blue-600 h-8 rounded-full flex items-center justify-end pr-3 transition-all"
                              style={{ width: `${getCategoryPercentage(amount)}%` }}
                            >
                              <span className="text-white text-xs font-medium">
                                {getCategoryPercentage(amount)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-32 text-right text-sm font-semibold">
                          {formatCurrency(amount)}
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">잔액</span>
                    <span className={`text-xl font-bold ${summary.income - summary.expense >= 0 ? 'text-blue-600' : 'text-red-600'
                      }`}>
                      {formatCurrency(summary.income - summary.expense)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 등록 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              {type === TransactionType.INCOME ? '💰 수입 등록' : '💸 지출 등록'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">날짜</label>
                <input
                  type="date"
                  name="date"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newTransaction.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">카테고리</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">카테고리 선택</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">금액</label>
                <input
                  type="number"
                  name="amount"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newTransaction.amount}
                  onChange={handleChange}
                  step="1"
                  min="0"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">메모</label>
                <textarea
                  name="memo"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newTransaction.memo}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2 px-4 text-white rounded-lg ${type === TransactionType.INCOME
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-red-500 hover:bg-red-600'
                    }`}
                >
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Dashboard;