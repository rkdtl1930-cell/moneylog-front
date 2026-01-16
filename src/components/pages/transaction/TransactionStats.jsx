import { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";
import transactionService from "../../services/transaction.service";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function TransactionStats(){
  const currentUser = useUserStore((state)=>state.user)
  const mid = currentUser?.id
  const [month, setMonth] = useState(()=>{
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  })
  const [transactions, setTransactions] = useState([])
  const categories = ["외식","배달","교통","쇼핑","월급","기타","휴대폰","구독","적금"];
  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#FF9F40", "#9966FF", "#FF69B4", "#00CED1", "#FFA500"]

  useEffect(() =>{
    const fetchMonthlyTransactions = async() =>{
      if(!mid||!month){
        return
      }
      const [year, mon] = month.split("-")
      const start = `${year}-${mon}-01`
      const end = `${year}-${mon}-${new Date(year, mon, 0).getDate()}`
      try{
        const res = await transactionService.getListByPeriod(mid, start, end, 1, 100)
        setTransactions(res.data.dtoList||[])
      }catch(err){
        console.log(err)
        setTransactions([])
      }
    }
    fetchMonthlyTransactions()
  },[mid,month])

  const pieData = categories.map((cat)=>{
    const total = transactions
      .filter(t=>t.type==="EXPENSE"&&t.category===cat)
      .reduce((sum,t)=>sum+t.amount,0)
    return {name:cat, value:total}
  }).filter(d=>d.value>0)
  
  const totalIncome = transactions
    .filter(t=>t.type==="INCOME")
    .reduce((sum, t)=>sum+t.amount, 0)
  
  const totalExpense = transactions
    .filter(t=>t.type==="EXPENSE")
    .reduce((sum, t)=>sum+t.amount, 0)


  const barData = [
    {name : month, income : totalIncome, expense : totalExpense}
  ]

  return(<>
    <div className="container mt-4">
      <div className="row mb-3">
        <div className="col-md-3">
          <div className="mb-3">
            <label htmlFor="monthInput" className="form-label fw-bold">
              월선택
            </label>
            <input id="monthInput" type="month" className="form-control" value={month} onChange={(e)=>setMonth(e.target.value)}/>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <h5>카테고리별 지출 비율</h5>
          {pieData.length>0?(
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100} 
                  fill="#8884d8" 
                  label={(entry)=>`${entry.name}:${entry.value.toLocaleString()}원`}
                  stroke="none"
                  strokeWidth={0}>
                  {pieData.map((entry,index)=>(
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                  ))}
                </Pie>
                <Tooltip formatter={(value)=>`${value.toLocaleString()}원`}
                  contentStyle={{backgroundColor:"#1f2a44", border:"none",borderRadius:"8px", padding:"8px"}}
                  itemStyle={{color:"#ffffff"}}
                  labelStyle={{color:"#eaeaea", fontWeight:600}}/>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ):<p>지출 내역이 없습니다.</p>}
        </div>
        <div className="col-md-6">
          <h5>월별 총 수입 / 총 지출 요약</h5>
          {totalIncome + totalExpense > 0 ?(
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{top:20, right:30,left:0,bottom:5}}>
                <XAxis dataKey="name"/>
                <YAxis />
                <Bar dataKey="income" fill="#6ccfcf" name="총 수입" activeBar={false}/>
                <Bar dataKey="expense" fill="#FF6b6b" name="총 지출" activeBar={false}/>
                <Tooltip shared={false} formatter={(value)=>`${value.toLocaleString()}원`}
                  contentStyle={{backgroundColor:"#1f2a44", border:"none", borderRadius:"8px", padding:"8px"}}
                  itemStyle={{color:"#ffffff"}}
                  labelStyle={{color:"#eaeaea", fontWeight:600}}/>
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          ):<p>수입/지출 내역이 없습니다.</p>}
        </div>
      </div>
    </div>
  </>)
}