/* 대시보드 > 예산 부분 카드*/
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import useUserStore from "../../../store/useUserStore";
import budgetService from "../../../services/budget.service";

export default function Budget(){
  const currentUser = useUserStore((state)=>state.user)
  const mid = currentUser?.id
  const [budgets, setBudgets] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const size = 10
  const [showEdit, setShowEdit] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [newLimit, setNewLimit] = useState("")

  const fetchBudget = async() =>{
    if(!mid){
      return
    }
    try{
      const res = await budgetService.getBudgets(mid, page, size)
      setBudgets(res.data.dtoList||[])
      setTotalPages(Math.ceil(res.data.total/size))
    }catch(err){
      console.log(err)
      setBudgets([])
      setTotalPages(1)
    }
  }

  useEffect(()=>{
    fetchBudget()
  },[mid,page])

  const openEdit = (budget) => {
    setEditingBudget(budget)
    setNewLimit(budget.limitAmount)
    setShowEdit(true)
  }

  const closeEdit = () => setShowEdit(false)

  const handleSave = async() =>{
    try{
      if(editingBudget.id){
        await budgetService.updateLimit(mid, newLimit)
      }else{
        await budgetService.createBudget({
          year : editingBudget.year,
          month : editingBudget.month,
          limitAmount:newLimit
        })
      }
      fetchBudget()
      closeEdit()
    }catch(err){
      console.log(err)
    }
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

  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()+1

  const handleOpenBudget = () => {
    const foundBudget = budgets.find(
      (b)=>b.year===currentYear && b.month===currentMonth
    );
    const budget = foundBudget || {
      id : null,
      year : currentYear,
      month : currentMonth,
      limitAmount : 0,
      usedAmount : 0
    };
    openEdit(budget);
  }

  return(<>
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">예산 목록</h4>
        <Button variant="primary" onClick={handleOpenBudget}>
          예산 설정({currentYear}-{currentMonth})
        </Button>
      </div>
      
      <ul className="list-group">
        {budgets.map((b)=>{
          const remainRate = ((b.limitAmount - b.usedAmount)/b.limitAmount*100).toFixed(1)
          const remainAmount = b.limitAmount - b.usedAmount
          return(
            <li key={b.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{b.year}-{b.month}</strong> - 
                예산 : {b.limitAmount.toLocaleString()}원, 
                사용 : {b.usedAmount.toLocaleString()}원,{" "}
                <span style={{color : remainAmount<0?"red":"inherit"}}>남은 예산 : {remainAmount.toLocaleString()}원 ({remainRate}%)</span>
              </div>
            </li>
          )
        })}
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

      <Modal show={showEdit} onHide={closeEdit}>
        <Modal.Header closeButton>
          <Modal.Title>예산 설정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="budgetLimit">
              <Form.Label>예산 금액</Form.Label>
              <Form.Control type="number" value={newLimit} onChange={(e)=>setNewLimit(e.target.value)}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSave}>저장</Button>
          <Button variant="secondary" onClick={closeEdit}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </div>
  </>)
}