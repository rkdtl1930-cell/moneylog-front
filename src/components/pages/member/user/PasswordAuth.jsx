import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import memberService from "../../../services/member.service";

export default function PasswordAuth(){
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const targetPath = location.state?.to || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await memberService.verifyPassword(password);
      if(res.data === true){
        navigate(targetPath);
      }else{
        setError("비밀번호가 올바르지 않습니다.");
      }
    }catch(err){
      console.log(err);
      setError("인증 중 오류가 발생했습니다.");
    }
  }

  return(<>
    <div className="container mt-4" style={{maxWidth:"400px"}}>
      <h3>비밀번호 인증</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">비밀번호</label>
          <input type="password" id="password" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary w-100">인증</button>
      </form>
    </div>
  </>)
}