import { useEffect, useState } from 'react';
import useUserStore from '../../store/useUserStore';
import { useNavigate } from 'react-router-dom';
import { checkUsernameService, registerService } from '../../services/auth.service';
import './Member.css'

export default function Register() {
  // 백엔드 스펙에 맞춘 초기 state
  const [member, setMember] = useState({
    username: '',
    password: '',
    name: '',
    nickname: '',
    interesting: 'record' // 기본값: 기록형
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const currentUser = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  // 각 필드별 에러 state
  const [errors, setErrors] = useState({
    name: false,
    nickname: false,
    username: false,
    password: false,
    passwordConfirm: false
  });

  useEffect(() => {
    if (currentUser?.id) {
      navigate('/profile');
    }
  }, [currentUser, navigate]);

  const handleRegister = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // 유효성 검사
    const newErrors = {
      name: !member.name,
      nickname: !member.nickname,
      username: !member.username,
      password: !member.password,
      passwordConfirm: !passwordConfirm
    };

    setErrors(newErrors);

    // 하나라도 에러가 있으면 return
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    // 비밀번호 확인 검사
    if (member.password !== passwordConfirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 아이디 중복 확인 체크
    if (usernameAvailable !== true) {
      setErrorMessage('아이디 중복 확인을 해주세요.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    // 백엔드로 전송할 데이터
    const registerData = {
      username: member.username,
      password: member.password,
      name: member.name,
      nickname: member.nickname,
      interesting: member.interesting // "record" 또는 "goal"
    };

    registerService(registerData)
      .then((response) => {
        console.log(response.data);
        navigate('/login');
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.status === 409) {
          setErrorMessage('이미 존재하는 아이디입니다.');
        } else {
          setErrorMessage('예상하지 못한 에러가 발생했습니다.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    
    // 입력하면 해당 필드 에러 제거
    if (submitted) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
    
    // 입력하면 에러 제거
    if (submitted) {
      setErrors(prev => ({
        ...prev,
        passwordConfirm: false
      }));
    }
  };

  const handleUserTypeChange = (type) => {
    setMember((prevState) => ({
      ...prevState,
      interesting: type
    }));
  };

  const checkUsernameAvailability = () => {
    if (!member.username) {
      setErrorMessage('아이디를 입력해주세요.');
      return;
    }
    checkUsernameService(member.username)
      .then((res) => {
        setUsernameAvailable(res.data.available);
      })
      .catch((err) => {
        console.log(err);
        setUsernameAvailable(false);
      });
  };

  return (
    <>
      <div className='member-wrap'>
        <h1>회원가입</h1>
        <div className="member">
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <form onSubmit={handleRegister} noValidate>
            {/* 이름 입력 */}
            <div className="input-group">
              <label htmlFor="name">이름</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="이름을 입력하세요"
                value={member.name}
                onChange={handleChange}
                required
              />
              {submitted && errors.name && (
                <div className="invalid-feedback">이름을 입력해주세요</div>
              )}
            </div>

            {/* 닉네임 입력 */}
            <div className="input-group">
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                name="nickname"
                className="form-control"
                placeholder="닉네임을 입력하세요"
                value={member.nickname}
                onChange={handleChange}
                required
              />
              {submitted && errors.nickname && (
                <div className="invalid-feedback">닉네임을 입력해주세요</div>
              )}
            </div>

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
              <button
                type="button"
                className="btn btn-primary"
                onClick={checkUsernameAvailability}
              >
                중복확인
              </button>
              {submitted && errors.username && (
                <div className="invalid-feedback">아이디를 입력해주세요</div>
              )}
              {usernameAvailable === true && (
                <div className="text-success invalid-feedback">사용 가능한 아이디입니다.</div>
              )}
              {usernameAvailable === false && (
                <div className="text-danger invalid-feedback">이미 존재하는 아이디입니다.</div>
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

            {/* 비밀번호 확인 */}
            <div className="input-group">
              <label htmlFor="passwordConfirm">비밀번호 확인</label>
              <input
                type="password"
                name="passwordConfirm"
                className="form-control"
                placeholder="비밀번호를 다시 입력하세요"
                value={passwordConfirm}
                onChange={handlePasswordConfirmChange}
                required
              />
              {submitted && errors.passwordConfirm && (
                <div className="invalid-feedback">비밀번호 확인을 입력해주세요</div>
              )}
              {passwordConfirm && member.password !== passwordConfirm && (
                <div className="text-danger invalid-feedback">비밀번호가 일치하지 않습니다.</div>
              )}
              {passwordConfirm && member.password === passwordConfirm && (
                <div className="text-success invalid-feedback">비밀번호가 일치합니다.</div>
              )}
            </div>

            {/* 사용자 유형 선택 (기록형/목표형) */}
            <div className="type-box">
              <label className="form-label fw-bold">사용자 유형 선택</label>
              <div className="card-check-group">
                <input
                  type="radio"
                  name="userType"
                  id="record"
                  checked={member.interesting === "record"}
                  onChange={() => handleUserTypeChange("record")}
                />
                <label htmlFor="record" className="card-check">
                  <h4>기록형</h4>
                  <p>
                    매일의 수입과 지출을 빠르게 기록하고
                    소비 흐름을 한눈에 확인하고 싶은 분
                  </p>
                </label>

                <input
                  type="radio"
                  name="userType"
                  id="goal"
                  checked={member.interesting === "goal"}
                  onChange={() => handleUserTypeChange("goal")}
                />
                <label htmlFor="goal" className="card-check">
                  <h4>목표형</h4>
                  <p>
                    한 달 목표 금액을 정하고
                    지금 얼마나 가까워졌는지 확인하고 싶은 분
                  </p>
                </label>
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <button
              className="btn btn-primary loginBtn"
              disabled={loading}
            >
              {loading ? '처리중...' : '회원가입'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}