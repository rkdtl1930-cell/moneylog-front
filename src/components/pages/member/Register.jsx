import { useEffect, useState } from "react";
import Member from "../../models/Member";
import useUserStore from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";
import { checkUsernameService, registerService } from "../../services/auth.service";

export default function Register(){
  const [member, setMember] = useState(new Member('','',''))
  const [submitted, setSubmitted] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrormessage] = useState('')
  const currentUser = useUserStore((state)=>state.user)
  const navigate = useNavigate()
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState(null)

  useEffect(()=>{
    if(currentUser?.id){
      navigate('/profile')
    }
  },[])
  
  const handleRegister = (e) =>{
    e.preventDefault()
    setSubmitted(true)
    if(!member.name || !member.password || !member.name){
      return
    }
    setLoading(true)
    registerService(member)
    .then((response)=>{
      console.log(response.data)
      navigate('/login')
    })
    .catch((error)=>{
      console.log(error)
      if(error?.response?.status==409){
        setErrormessage("이미 존재하는 아이디 입니다.")
      }else{
        setErrormessage("예상하지 못한 에러가 발생했습니다.")
      }
    })
  }

  const handleChange = (e) =>{
    const {name, value} = e.target
    setMember((prevState) =>{
      return{
        ...prevState,
        [name] : value
      }
    })
  }

  const handlePasswordConfirmChange = (e) =>{
    setPasswordConfirm(e.target.value)
  }

  const checkUsernameAvailability = () =>{
    if(!member.username) return
    checkUsernameService(member.username)
    .then(res=>{
      setUsernameAvailable(res.data.available)
    })
    .catch(err=>{
      console.log(err)
      setUsernameAvailable(false);
    })
  }

  return(<>
    <div className="container mt-5">
      <div className="card ms-auto me-auto p-3 shadow-lg custom-card">
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form onSubmit={handleRegister} noValidate className={submitted ? 'was-validated':''}>
          <label htmlFor="name">이름</label>
          <input type="text" name="name" className="form-control"
            placeholder="name" value={member.name}
            onChange={handleChange}
            required/>
          <div className="invalid-feedback">이름을 입력해주세요</div>
          <label htmlFor="username">아이디</label>
          <div className="input-group mb-2">
            <input type="text" name="username" className="form-control"
              placeholder="username" value={member.username}
              onChange={handleChange}
              required/>
            <button type="button" className="btn btn-ouline-secondary" onClick={checkUsernameAvailability}>중복확인</button>
          </div>
          {usernameAvailable === true && <div className="text-success mb-2">사용 가능한 아이디입니다.</div>}
          {usernameAvailable === false && <div className="text-danger mb-2">이미 존재하는 아이디입니다.</div>}
          <div className="invalid-feedback">아이디를 입력해주세요</div>
          <label htmlFor="password">비밀번호</label>
          <input type="password" name="password" className="form-control"
            placeholder="password" value={member.password}
            onChange={handleChange}
            required/>
          <div className="invalid-feedback">비밀번호를 입력해주세요</div>
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input type="password" name="passwordConfirm" className="form-control"
            placeholder="password confirm" value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
            required/>
          {passwordConfirm && member.password !== passwordConfirm && (<div className="text-danger">비밀번호가 일치하지 않습니다.</div>)}
          {passwordConfirm && member.password === passwordConfirm && (<div className="text-success">비밀번호가 일치합니다.</div>)}
          <button className="btn btn-info text-white w-100 mt-3" disabled={loading}>회원가입</button>
        </form>
      </div>
    </div>
  </>)
}