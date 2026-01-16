import { useEffect, useState } from "react";
import Member from "../../models/Member";
import useUserStore from "../../store/useUserStore";
import { Link, useNavigate } from "react-router-dom";
import { loginService } from "../../services/auth.service";

export default function Login(){
  const [member, setMember] = useState(new Member('','',''))
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const currentUser = useUserStore((state)=>state.user)
  const navigate = useNavigate()

  useEffect(()=>{
    if(currentUser?.id)
      navigate('/profile')
  })

  const handleChange = (e) => {
    const {name, value} = e.target
    setMember((prevState)=>{
      return{
        ...prevState,
        [name] : value
      }
    })
  }
  
  const setCurrentUser = useUserStore((state)=>state.setCurrentUser)

  const handleLogin = (e) => {
    e.preventDefault()
    setSubmitted(true)

    if(!member.username || !member.password){
      return
    }
    setLoading(true)
    loginService(member)
    .then((response)=>{
      console.log("Login response.data:", response.data); 
      console.log("currentUser from store:", useUserStore.getState().user);
      setCurrentUser(response.data)
      console.log("After setCurrentUser, store user:", useUserStore.getState().user); // 여기

      navigate('/home')
    })
    .catch((error)=>{
      console.log(error)
      setErrorMessage("아이디 또는 패스워드가 일치하지 않습니다.")
    })
  }

  return(<>
    <div className="container mt-5">
      <div className="card ms-auto me-auto p-3 shadow-lg custom-card">
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form onSubmit={handleLogin} noValidate className={submitted ? 'was-validated':''}>
          <div className="form-group mb-2">
            <label htmlFor="username">아이디</label>
            <input type="text" name="username" className="form-control"
              placeholder="username" value={member.username}
              onChange={handleChange}
              required/>
            <div className="invalid-feedback">아이디를 입력해주세요</div>
            <label htmlFor="password">비밀번호</label>
            <input type="password" name="password" className="form-control"
              placeholder="password" value={member.password}
              onChange={handleChange}
              required/>
            <div className="invalid-feedback">비밀번호를 입력해주세요</div>
          </div>
          <button className="btn btn-info text-white w-100 mt-3" disabled={loading}>로그인</button>
        </form>
        <Link to="/register" className="btn btn-link" style={{color : 'darkgray'}}>회원가입하기</Link>
      </div>
    </div>
  </>)
}