import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import noticeService from "../../services/notice.service";

export default function Admin(){
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

  const handleDelete = async(id) => {
    const ok = window.confirm("정말로 삭제하시겠습니까?");
    if(!ok){
      return
    }
    try{
      await noticeService.deleteNotice(id);
      alert("삭제되었습니다.");
      fetchData();
    }catch(err){
      console.log(err);
      alert("삭제 중 오류가 발생했습니다.")
    }
  }

  return(
    <div className="container mt-4">
      <h3>공지사항(관리자 페이지)</h3>
      <button className="btn btn-primary" onClick={()=>navigate("/notice/write")}>
        공지사항 작성
      </button>
      <div className="d-flex jusify-content-between align-items-center mb-3">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th style={{width:"10%"}}>번호</th>
              <th style={{width:"50%"}}>제목</th>
              <th style={{width:"20%"}}>작성일</th>
              <th style={{width:"20%"}}>관리</th>
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
                  <td>
                      <>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/notice/edit/${notice.id}`);
                          }}
                        >
                          수정
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notice.id);
                          }}
                        >
                          삭제
                        </button>
                      </> 
                  </td>
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