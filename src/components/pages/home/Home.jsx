import { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore"
import noticeService from "../../services/notice.service";
import { useNavigate } from "react-router-dom";
import HomeTransaction from "./HomeTransactions";
import "./Home.css"

export default function Home() {
  const currentUser = useUserStore((state)=>state.user)
  const isLoggedin = !!currentUser?.id;
  const [notices, setNotices] = useState([])
  const navigate = useNavigate();
  

  useEffect(()=>{
    const fetchNotices = async() =>{
      try{
        const res = await noticeService.getNotices(1,10);
        setNotices(res?.data?.dtoList || []);
      }catch(err){
        console.log(err);
        setNotices([]);
      }
    }
    fetchNotices();
  },[])
  

  return(<>
    <div className="container mt-4">
      <div className="card mb-4 shadow-sm">
        <div className="card-header custom-card-header">
          <h5 className="mb-0">공지사항</h5>
        </div>
        <div className="card-body p-0 custom-card-body">
          {notices.length > 0 ? (
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "10%" }}>번호</th>
                  <th style={{ width: "70%" }}>제목</th>
                  <th style={{ width: "20%" }}>작성일</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice) => (
                  <tr
                    key={notice.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/notice/view/${notice.id}`)}
                  >
                    <td>{notice.id}</td>
                    <td>{notice.title}</td>
                    <td>{notice.createTime?.substring(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-3 mb-0 text-center text-muted">
              공지사항이 없습니다.
            </p>
          )}
        </div>
        {notices.length > 0 && (
          <div className="card-footer text-end">
            <button
              className="btn btn-notice-all"
              onClick={() => navigate("/notice/list")}
            >
              전체보기
            </button>
          </div>
        )}
      </div>
      <div className="card mb-4 shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center custom-card-header">
          <h5 className="mb-0">일주일 수입 & 지출</h5>
          {isLoggedin && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/transaction/list")}
            >
              전체보기
            </button>
          )}
        </div>
        <div className="card-body custom-card-body">
          {isLoggedin ? (
            <HomeTransaction />
          ) : (
            <p>
              <span
                style={{ color: "#2ecc71", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                로그인
              </span>
              을 하셔야 확인할 수 있습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  </>)
}