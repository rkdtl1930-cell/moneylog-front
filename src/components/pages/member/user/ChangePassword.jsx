import { useState } from "react";
import { useNavigate } from "react-router-dom";
import memberService from "../../../services/member.service";

export default function ChangePassword(){
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmPW, setConfirmPw] = useState("")
  const [match, setMatch] = useState("")
  const navigate = useNavigate();

  const handleNewPasswordChange = (e) =>{
    const value = e.target.value;
    setNewPassword(value);
    setMatch("")
  }

  const handleConfirmPasswordChange = (e) =>{
    const value = e.target.value;
    setConfirmPw(value);
    if(value){
    setMatch(value === newPassword ? "비밀번호가 일치합니다.": "비밀번호가 일치하지 않습니다.");
    }else{
      setMatch("");
    }
  }


  const handleChange = async (e) =>{
    e.preventDefault();
    try{
      await memberService.changPassword(newPassword);
      navigate('/profile');
    }catch(err){
      console.log(err);
      setError("비밀번호 변경 중 오류가 발생했습니다.");
    }
  }
  return(<>
    <div className="container mt-4" style={{maxWidth:"400px"}}>
      <h3>비밀번호 변경</h3>
      <form onSubmit={handleChange}>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">새 비밀번호</label>
          <input type="password" id="newPassword" className="form-control" value={newPassword} onChange={handleNewPasswordChange} required/>
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPW" className="form-label">새 비밀번호 확인</label>
          <input type="password" id="confirmPw" className="form-control" value={confirmPW} onChange={handleConfirmPasswordChange} required/>
        </div>
        {match && <p className={match.includes("합니다") ? "text-success" : "text-danger"}>{match}</p>}
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary w-100">비밀번호 변경</button>
      </form>
    </div>
  </>)
}