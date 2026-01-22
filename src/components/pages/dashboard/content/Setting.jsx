import { useState } from "react";
import memberService from "../../../services/member.service";
import { useLocation, useNavigate } from "react-router-dom";

export default function Setting() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const targetPath = location.state?.to || "/dashboard/mypage";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await memberService.verifyPassword(password);
      if (res.data === true) {
        navigate(targetPath);
      } else {
        setError("비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      console.log(err);
      setError("인증 중 오류가 발생했습니다.");
    }
  }

  return (
    <>
      <div className="dash-board-con card setting">
        <form onSubmit={handleSubmit}>
          <img src="/images/dashboard/ico-password.svg" alt="" />
          <p>비밀번호를 입력해주세요.</p>
          <input type="password" placeholder="비밀번호를 입력해주세요." value={password} onChange={(e)=>setPassword(e.target.value)} required/>
          {error && <p className="text-danger">{error}</p>}
          <button  type="submit"className="btn btn-primary">확인</button>
        </form>
      </div>
    </>
  );
}
