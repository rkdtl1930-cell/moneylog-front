import useUserStore from "../../store/useUserStore";
import { useEffect, useState } from "react";
import { TransactionType } from "../../models/TransactionType";
import transactionService from "../../services/transaction.service";
import { useNavigate } from "react-router-dom";

export default function TransactionWrite(){
  const currentUser = useUserStore((state) => state.user);
  const [transaction, setTransactions] = useState({date:"",amount:"",memo:""})
  const [type, setType] = useState(TransactionType.INCOME)
  const [category, setCategory] = useState("")
  const categories = ["외식","배달","교통","쇼핑","월급","기타"];
  const navigate = useNavigate()
  

  useEffect(()=>{
    if(!currentUser){
      navigate('/401')
      return null;
    }
  },[currentUser,navigate])
  

  const handleChange = (e) => {
    const {name,value} = e.target
    setTransactions((prev)=>(
      {...prev, [name] : value}
    ))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!category){
      alert("카테고리를 선택해주세요!")
      return
    }
    try{
      const newTransaction = {
        mid: currentUser.id,
        type,
        category,
        ...transaction,
        amount : parseInt(transaction.amount),
      }
      console.log("payload", newTransaction);
      await transactionService.register(newTransaction)
      alert("작성이 완료되었습니다!")
      setTransactions({date:"",amount:"",memo:""})
      setType(TransactionType.INCOME)
      setCategory("")
    } catch(err){
      console.log(err)
      alert("작성에 실패했습니다.")
    }
  }

  

  
  return(<>
    <div className="container mt-4">
      <h3>수입&지출 작성</h3>
      <form onSubmit={handleSubmit}>r
        <div className="mb-3">
          <label>수입&지출 날짜</label>
          <input type="date" name="date" className="form-control" value={transaction.date} onChange={handleChange} required/>
        </div>
        <div className="mb-3">
          <label>종류</label>
          <select className="form-control" value={type} onChange={(e)=>setType(e.target.value)} required>
            <option value={TransactionType.INCOME}>수입</option>
            <option value={TransactionType.EXPENSE}>지출</option>
          </select>
        </div>
        <div className="mb-3">
          <label>카테고리</label>
          <select className="form-control" value={category} onChange={(e)=>setCategory(e.target.value)} required>
            <option value="">카테고리 선택</option>
            {categories.map((c)=>(
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>금액</label>
          <input type="number" name="amount" className="form-control" value={transaction.amount} onChange={handleChange} step="1" min="0" required/>
        </div>
        <div className="mb-3">
          <label>메모</label>
          <textarea name="memo" className="form-control" value={transaction.memo} onChange={handleChange}/>
        </div>
        <button type="submit" className="btn btn-primary">등록</button>
      </form>
    </div>
  </>)
}