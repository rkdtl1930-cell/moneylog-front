import { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";
import transactionService from "../../services/transaction.service";

export default function HomeTransaction(){
  const currentUser = useUserStore((state)=>state.user)
  const [transactions, setTransactions] = useState([])
  const mid = currentUser?.id
  const [page, setPage] = useState(1)
  const size = 10
  const [totalPages, setTotalPages] = useState(1)
  function formatDateLocal(date){
    const y = date.getFullYear();
    const m = String(date.getMonth()+1).padStart(2,"0")
    const d =String(date.getDate()).padStart(2,"0")
    return `${y}-${m}-${d}`
  }
  const today = new Date()
  const end = formatDateLocal(today)

  const startDate = new Date(today.getTime() - 6*24*60*60*1000)
  const start = formatDateLocal(startDate)

  useEffect(()=>{
    if(!mid){
      return
    }
    const fetchTransactions = async () => {
      try {
        const res = await transactionService.getListByPeriod(mid, start, end, page, size)
        console.log(res.data)
        setTransactions(res.data.dtoList || [])
        setTotalPages(res.data.end || 1)
      }catch(err){
        console.log(err)
      }
    }
    fetchTransactions()
  },[mid, page])
  if(!transactions || transactions. length === 0){
    return <p>최근 7일 거래 내역이 없습니다.</p>
  }

  const maxButtons = 5
  const currentBlock = Math.floor((page-1)/maxButtons)
  const startPage = currentBlock*maxButtons + 1
  const endPage = Math.min(startPage+maxButtons-1,totalPages)
  const pages = []
  for (let i = startPage; i <= endPage; i++){
    pages.push(i)
  }

  const handlePrevBlock = () => {
    const prevBlockLastPage = startPage -1
    if (prevBlockLastPage>=1) setPage(prevBlockLastPage)
  }

  const handleNextBlock = () => {
    const nextBlockFirstPage = endPage + 1
    if(nextBlockFirstPage <= totalPages) setPage(nextBlockFirstPage)
  }

  return(<>
    <div>
      <ul>
        {transactions.map((t)=>(
          <li key={t.id} className={`list-group-item d-flex justify-content-between align-items-center ${t.type==="INCOME"?"text-success":"text-danger"}`}>{t.date} - {t.category} - {t.type} - {t.amount}원</li>
        ))}
      </ul>
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          {page > 1 && (
            <li className="page-item">
              <button className="page-link" onClick={handlePrevBlock}>
                이전
              </button>
            </li>
          )}
          {pages.map((p)=>(
            <li key={p} className={`page-item ${page===p?"active":""}`}>
              <button className="page-link" onClick={()=>setPage(p)}>
                {p}
              </button>
            </li>
          ))}
          {endPage < totalPages &&(
            <li className="page-item">
              <button className="page-link" onClick={handleNextBlock}>
                다음
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  </>)
}