import { useEffect, useState } from "react";
import useUserStore from "../../../store/useUserStore";
import transactionService from "../../../services/transaction.service";
import './Content.css'
import Popup from "../popup/Popup";

export default function Expense() {
  const currentUser = useUserStore((state) => state.user);
  const mid = currentUser?.id
  const [transactions, setTransactions] = useState([])
  const [page, setPage] = useState(1)
  const [size] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [month, setMonth] = useState(() => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  })
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);

  const fetchTransactions = async () => {
    if (!mid) {
      return
    }
    try {
      let res
      if (startDate && endDate) {
        res = await transactionService.getListByPeriod(mid, startDate, endDate, page, size)
      } else if (month) {
        res = await transactionService.getListByMonth(mid, month, page, size)
      } else {
        res = await transactionService.getListByMonth(mid, null, page, size)
      }
      setTransactions(res.data.dtoList || [])
      setTotalPages(Math.ceil(res.data.total / size))
    } catch (err) {
      console.log(err)
      setTransactions([])
      setTotalPages(1)
    }
  }

  useEffect(() => {
    if (!mid) {
      return;
    }
  }, [mid, page])

  const handleFetch = async () => {
    setPage(1);
    await fetchTransactions();
  }

  const maxButtons = 5
  const currentBlock = Math.floor((page - 1) / maxButtons)
  const startPage = currentBlock * maxButtons + 1
  const endPage = Math.min(startPage + maxButtons - 1, totalPages)
  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  const handlePrevBlock = () => {
    const prevBlockLastPage = startPage - 1
    if (prevBlockLastPage >= 1) setPage(prevBlockLastPage)
  }

  const handleNextBlock = () => {
    const nextBlockFirstPage = endPage + 1
    if (nextBlockFirstPage <= totalPages) setPage(nextBlockFirstPage)
  }

  const handleReset = () => {
    const today = new Date();
    setMonth(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);
    setStartDate("");
    setEndDate("");
    setPage(1);
    setTransactions([]);
    setTotalPages(1);
  };
  return (<>
    <h1>
      History
    </h1>
    <div className="container p-4">
      <div className="search-bar">
        <div className="col-md-3">
          <label className="form-label">시작일</label>
          <input type="date" className="form-control" value={startDate} onChange={(e) => {
            setStartDate(e.target.value)
            setMonth("")
            setPage(1)
          }} />
        </div>
        <div className="col-md-3">
          <label className="form-label">종료일</label>
          <input type="date" className="form-control" value={endDate} onChange={(e) => {
            setEndDate(e.target.value)
            setMonth("")
            setPage(1)
          }} />
        </div>
        <div className="btn-box">
          <button className="btn btn-primary me-2 w-50" onClick={handleFetch}>조회</button>
          <button className="btn btn-reset w-50" onClick={handleReset}>초기화</button>
        </div>
      </div>
      <div className="row mb-3 align-items-end">
        {/* <div className="col-md-4">
          <label className="form-label">월 선택:</label>
          <input type="month" className="form-control" value={month} onChange={(e)=>{
            setMonth(e.target.value)
            setStartDate("")
            setEndDate("")
            setPage(1)
          }}/>
        </div> */}
        {transactions.length === 0 ? (
          <p className="no-data">조회된 내역이 없습니다.</p>
        ) : (<>
          <div className="card">
            <h5>거래내역</h5>
            <div className="table-wrap">
              <table className="common-table">
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>카테고리</th>
                    <th>수입/지출</th>
                    <th>금액</th>
                    <th>메모</th>
                    <th>관리</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{t.date}</td>
                      <td>{t.category}</td>
                      <td className={t.type === "INCOME" ? "income" : "expense"}>
                        <span>{t.type === "INCOME" ? "수입" : "지출"}</span>
                      </td>
                      <td>
                        {t.amount.toLocaleString()}원
                      </td>
                      <td>{t.memo || "-"}</td>
                      <td className="btn-box">
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setEditTransaction(t);
                            setEditModalOpen(true);
                          }}
                        >
                          수정
                        </button>

                        <button
                          className="del-btn"
                          onClick={async () => {
                            if (window.confirm("정말로 삭제하시겠습니까?")) {
                              await transactionService.delete(t.id);
                              fetchTransactions();
                            }
                          }}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>)}
        {editModalOpen && editTransaction && (
          <Popup open={editModalOpen} onClose={() => setEditModalOpen(false)}>
            <div className="popup-header">
              <h3>거래내역 수정</h3>
              <button className="close-btn" onClick={() => setEditModalOpen(false)}>
                ×
              </button>
            </div>

            <div className="popup-body">
              <div className="form-group">
                <label>날짜</label>
                <input
                  type="date"
                  value={editTransaction.date}
                  onChange={(e) =>
                    setEditTransaction({ ...editTransaction, date: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>카테고리</label>
                <input
                  type="text"
                  value={editTransaction.category}
                  onChange={(e) =>
                    setEditTransaction({ ...editTransaction, category: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>타입</label>
                <select
                  value={editTransaction.type}
                  onChange={(e) =>
                    setEditTransaction({ ...editTransaction, type: e.target.value })
                  }
                >
                  <option value="INCOME">수입</option>
                  <option value="EXPENSE">지출</option>
                </select>
              </div>

              <div className="form-group">
                <label>금액</label>
                <input
                  type="number"
                  value={editTransaction.amount}
                  onChange={(e) =>
                    setEditTransaction({
                      ...editTransaction,
                      amount: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>메모</label>
                <input
                  type="text"
                  value={editTransaction.memo || ""}
                  onChange={(e) =>
                    setEditTransaction({ ...editTransaction, memo: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="popup-footer">
              <button className="btn close" onClick={() => setEditModalOpen(false)}>
                취소
              </button>
              <button
                className="btn primary"
                onClick={async () => {
                  await transactionService.modify(editTransaction);
                  setEditModalOpen(false);
                  fetchTransactions();
                }}
              >
                저장
              </button>
            </div>
          </Popup>
        )}

        {transactions.length > 0 && (
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              {page > 1 && (
                <li className="page-item">
                  <button className="page-link" onClick={handlePrevBlock}>
                    이전
                  </button>
                </li>
              )}
              {pages.map((p) => (
                <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setPage(p)}>
                    {p}
                  </button>
                </li>
              ))}
              {endPage < totalPages && (
                <li className="page-item">
                  <button className="page-link" onClick={handleNextBlock}>
                    다음
                  </button>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </div>
  </>)
}