import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import noticeService from "../../services/notice.service";
import "../landing/notice/Notice.css"

export default function NoticeEdit(){
  const {id} = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(()=>{
    const fetchNotice = async() =>{
      try{
        const res = await noticeService.getNotice(id);
        setTitle(res.data.title);
        setContent(res.data.content);
      }catch(err){
        console.log(err);
        alert("공지사항 정보를 불러오는 데 실패했습니다.");
        navigate("/admin");
      }
    }
    fetchNotice();
  },[id,navigate]);
  
  const handleUpdate = async () => {
    if(!title.trim() || !content.trim()){
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    try{
      await noticeService.updateNotice(id, {title, content});
      alert("공지사항이 수정되었습니다.");
      navigate("/admin");
    }catch(err){
      console.log(err);
      alert("공지사항 수정에 실패했습니다.");
    }
  }

  return(<>
    <div className="container mt-4">
      <h3>공지사항 수정</h3>
      <div className="mb--3">
        <label className="form-label">제목</label>
        <input type="text" className="form-control" value={title} onChange={(e)=>setTitle(e.target.value)}/>
      </div>
      <div className="mb--3">
        <label className="form-label">내용</label>
        <textarea className="form-control" rows="10" value={content} onChange={(e)=>setContent(e.target.value)}/>
      </div>
      <button className="btn btn-primary me-2" onClick={handleUpdate}>수정</button>
      <button className="btn btn-secondary" onClick={()=>navigate("/admin")}>취소</button>
    </div>
  </>)
}