import { useState } from "react";
import useUserStore from "../../store/useUserStore";
import { Link, useNavigate } from "react-router-dom";
import { loginService } from "../../services/auth.service";
import './Member.css'
import logoBlue from '../../../assets/b_logo.png';

export default function Login() {
  const [member, setMember] = useState({
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  const navigate = useNavigate();

  // 각 필드별 에러 state
  const [errors, setErrors] = useState({
    username: false,
    password: false
  });

  // useEffect(() => {
  //   if (currentUser?.id) {
  //     navigate('/dashboard/main');
  //   }
  // }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prevState) => ({
      ...prevState,
      [name]: value
    }));

    // 입력하면 해당 필드 에러 제거
    if (submitted) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // 유효성 검사
    const newErrors = {
      username: !member.username,
      password: !member.password
    };

    setErrors(newErrors);

    // 하나라도 에러가 있으면 return
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    setLoading(true);
    setErrorMessage('');

    loginService(member)
  .then((response) => {
    const user = response.data;

    setCurrentUser(user);

    // 관리자면 회원관리로
    if (user.role === 'ADMIN') {
      navigate('/dashboard/members');
    } else {
      navigate('/dashboard/main');
    }
  })
  .catch((error) => {
    console.log(error);
    setErrorMessage("아이디 또는 패스워드가 일치하지 않습니다.");
  })
  .finally(() => {
    setLoading(false);
  });

  };

  return (
    <>
      <div className='member-wrap'>
        <img src={logoBlue} alt="TalkPay 로고" className="logo"/>
        <h1>로그인</h1>
        <div className="member">
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <form onSubmit={handleLogin} noValidate>
            {/* 아이디 입력 */}
            <div className="input-group">
              <label htmlFor="username">아이디</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="아이디를 입력하세요"
                value={member.username}
                onChange={handleChange}
                required
              />
              {submitted && errors.username && (
                <div className="invalid-feedback">아이디를 입력해주세요</div>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div className="input-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="비밀번호를 입력하세요"
                value={member.password}
                onChange={handleChange}
                required
              />
              {submitted && errors.password && (
                <div className="invalid-feedback">비밀번호를 입력해주세요</div>
              )}
            </div>

            {/* 로그인 버튼 */}
            <button
              className="btn btn-primary loginBtn"
              disabled={loading}
            >
              {loading ? '처리중...' : '로그인'}
            </button>
          </form>

          <div className="link-box">
            <p>아직 회원이 아니시라면?</p>
            <Link to="/register" className="btn-link">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}