import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import memberService from "../../../services/member.service";
import useUserStore from "../../../store/useUserStore";

export default function MyPage() {
  const currentUser = useUserStore((state) => state.user);

  // 사용자 정보
  const [userInfo, setUserInfo] = useState({
    id: "",
    username: "",
    name: "",
    nickname: "",
    interesting: "record"
  });

  // 비밀번호
  const [newPassword, setNewPassword] = useState("");
  const [confirmPW, setConfirmPw] = useState("");
  const [match, setMatch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 컴포넌트 마운트 시 회원 정보 불러오기
  useEffect(() => {
    if (currentUser?.username) {
      loadMemberInfo();
    }
  }, [currentUser]);

  const loadMemberInfo = async () => {
    try {
      const response = await memberService.getMember(currentUser.username);
      console.log("Member info:", response.data);
      
      setUserInfo({
        id: response.data.id || "",
        username: response.data.username || "",
        name: response.data.name || "",
        nickname: response.data.nickname || "",
        interesting: response.data.interesting || "record"
      });
    } catch (err) {
      console.error("회원 정보 불러오기 실패:", err);
      setError("회원 정보를 불러오는데 실패했습니다.");
    }
  };

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserTypeChange = (type) => {
    setUserInfo(prev => ({
      ...prev,
      interesting: type
    }));
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setMatch("");
    setError("");
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPw(value);

    if (!value) {
      setMatch("");
    } else {
      setMatch(
        value === newPassword
          ? "비밀번호가 일치합니다."
          : "비밀번호가 일치하지 않습니다."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 비밀번호를 입력한 경우에만 일치 여부 확인
    if (newPassword || confirmPW) {
      if (newPassword !== confirmPW) {
        setError("비밀번호가 일치하지 않습니다.");
        return;
      }

      if (!newPassword) {
        setError("새 비밀번호를 입력해주세요.");
        return;
      }
    }

    // 비밀번호 변경만 가능 (현재 API 기준)
    if (!newPassword) {
      setError("변경할 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      await memberService.changPassword(newPassword);
      
      alert("비밀번호가 변경되었습니다.");
      
      // 비밀번호 필드 초기화
      setNewPassword("");
      setConfirmPw("");
      setMatch("");
      
    } catch (err) {
      console.error(err);
      setError("비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dash-board-con mypage">
      <h3>마이페이지</h3>

      <form onSubmit={handleSubmit} className="card">
        {error && <p className="text-danger mb-3">{error}</p>}

        {/* 아이디 (읽기 전용) */}
        <div className="mb-3">
          <label className="form-label">아이디</label>
          <input
            type="text"
            className="form-control"
            value={userInfo.username}
            readOnly
          />
        </div>

        {/* 이름 (읽기 전용) */}
        <div className="mb-3">
          <label className="form-label">이름</label>
          <input
            type="text"
            className="form-control"
            value={userInfo.name}
            readOnly
          />
        </div>

        {/* 닉네임 (읽기 전용 - API 없음) */}
        <div className="mb-3">
          <label className="form-label">닉네임</label>
          <input
            type="text"
            name="nickname"
            className="form-control"
            value={userInfo.nickname}
            readOnly
          />
          <small className="text-muted">닉네임 수정 api없음 ..</small>
        </div>

        {/* 새 비밀번호 */}
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            새 비밀번호
          </label>
          <input
            type="password"
            id="newPassword"
            className="form-control"
            value={newPassword}
            onChange={handleNewPasswordChange}
            autoComplete="new-password"
            placeholder="새 비밀번호를 입력하세요"
          />
        </div>

        {/* 새 비밀번호 확인 */}
        <div className="mb-3">
          <label htmlFor="confirmPW" className="form-label">
            새 비밀번호 확인
          </label>
          <input
            type="password"
            id="confirmPW"
            className="form-control"
            value={confirmPW}
            onChange={handleConfirmPasswordChange}
            autoComplete="new-password"
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>

        {/* 비밀번호 일치 메시지 */}
        {match && (
          <p
            className={
              match.includes("일치합니다")
                ? "text-success mb-3"
                : "text-danger mb-3"
            }
          >
            {match}
          </p>
        )}

        {/* 사용자 유형 (읽기 전용 - API 없음) */}
        <div className="mb-3">
          <label className="form-label">사용자 유형</label>

          <div className="card-check-group">
            <input
              type="radio"
              name="userType"
              id="record"
              checked={userInfo.interesting === "record"}
              disabled
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
              checked={userInfo.interesting === "goal"}
              disabled
            />
            <label htmlFor="goal" className="card-check">
              <h4>목표형</h4>
              <p>
                한 달 목표 금액을 정하고
                지금 얼마나 가까워졌는지 확인하고 싶은 분
              </p>
            </label>
          </div>
          <small className="text-muted">사용자 유형 변경 수정 api없음 ..</small>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "변경 중..." : "비밀번호 변경"}
        </button>
      </form>
    </div>
  );
}