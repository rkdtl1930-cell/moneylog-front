import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import noticeService from "../../services/notice.service";

export default function NoticeList(){
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchData = async() => {
    try{
      const res = await noticeService.getNotices(page, size);
      setNotices(res.data.dtoList || []);
      setTotalPages(Math.ceil(res.data.total/size));
    }catch(err){
      console.log(err);
      setNotices([]);
      setTotalPages(1);
    }
  }

  useEffect(() =>{
        const fetch = async() =>{
      fetchData()
    }
    fetch()
  },[page]);

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

  return(
    <div className="container mt-4">
      <h3>공지사항</h3>
      <div className="d-flex jusify-content-between align-items-center mb-3">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th style={{width:"10%"}}>번호</th>
              <th style={{width:"60%"}}>제목</th>
              <th style={{width:"30%"}}>작성일</th>
            </tr>
          </thead>
          <tbody>
            {notices.length === 0?(
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  공지사항이 없습니다.
                </td>
              </tr>
            ):(
              notices.map((notice)=>(
                <tr key={notice.id} style={{cursor:"pointer"}} onClick={()=>navigate(`/notice/view/${notice.id}`)}>
                  <td>{notice.id}</td>
                  <td>{notice.title}</td>
                  <td>{notice.createTime?.substring(0,10)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
  )
}