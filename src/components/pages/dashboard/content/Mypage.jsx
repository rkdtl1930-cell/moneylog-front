import { useState } from "react";
import { useNavigate } from "react-router-dom";
import memberService from "../../../services/member.service";

export default function MyPage() {
  const navigate = useNavigate();

  // 비밀번호
  const [newPassword, setNewPassword] = useState("");
  const [confirmPW, setConfirmPw] = useState("");
  const [match, setMatch] = useState("");
  const [error, setError] = useState("");

  // 고객 유형
  const [userType, setUserType] = useState("record");

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setMatch("");
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

    if (newPassword !== confirmPW) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await memberService.changPassword(newPassword);
      // userType도 여기서 같이 보내면 됨
      navigate("/dashboard/main");
    } catch (err) {
      console.error(err);
      setError("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="dash-board-con mypage">
      <h3>마이페이지</h3>

      <form onSubmit={handleSubmit} className="card">
        {/* 이름 */}
        <div className="mb-3">
          <label className="form-label">이름</label>
          <input
            type="text"
            className="form-control"
            value="홍길동"
            readOnly
          />
        </div>

        {/* 닉네임 */}
        <div className="mb-3">
          <label className="form-label">닉네임</label>
          <input
            type="text"
            className="form-control"
            value="닉네임"
          />
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
            required
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
            required
          />
        </div>

        {/* 비밀번호 일치 메시지 */}
        {match && (
          <p
            className={
              match.includes("일치합니다")
                ? "text-success"
                : "text-danger"
            }
          >
            {match}
          </p>
        )}

        {error && <p className="text-danger">{error}</p>}

        {/* 고객 유형 */}
        <div className="mb-3">
          <label className="form-label">고객 유형</label>

          <div className="card-check-group">
            <input
              type="radio"
              name="userType"
              id="record"
              checked={userType === "record"}
              onChange={() => setUserType("record")}
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
              checked={userType === "goal"}
              onChange={() => setUserType("goal")}
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

        <button type="submit" className="btn btn-primary w-100">
          회원정보 수정
        </button>
      </form>
    </div>
  );
}
