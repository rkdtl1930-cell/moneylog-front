import { useState, useEffect } from "react";
import memberService from "../../../services/member.service";
import useUserStore from "../../../store/useUserStore";
import { Navigate } from "react-router-dom";

export default function MyPage() {
  const currentUser = useUserStore((state) => state.user);
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  // 사용자 정보
  const [userInfo, setUserInfo] = useState({
    id: "",
    username: "",
    name: "",
    nickname: ""
  });

  // 원본 닉네임 (변경 여부 확인용)
  const [originalNickname, setOriginalNickname] = useState("");

  // 비밀번호
  const [newPassword, setNewPassword] = useState("");
  const [confirmPW, setConfirmPw] = useState("");
  const [match, setMatch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 컴포넌트 마운트 시 회원 정보 불러오기
  useEffect(() => {
    if (currentUser?.id) {
      loadMemberInfo();
    }
  }, [currentUser]);

  const loadMemberInfo = async () => {
    try {
      console.log("현재 사용자:", currentUser);
      
      // 스토어에 이미 사용자 정보가 있으면 그걸 사용
      if (currentUser) {
        setUserInfo({
          id: currentUser.id || "",
          username: currentUser.username || "",
          name: currentUser.name || "",
          nickname: currentUser.nickname || ""
        });
        setOriginalNickname(currentUser.nickname || "");
        return;
      }
      
      // API 호출이 필요한 경우
      const response = await memberService.getMember(currentUser.username);
      console.log("API 응답:", response.data);
      
      const data = response.data.dtoList && response.data.dtoList.length > 0 
        ? response.data.dtoList[0] 
        : response.data;
      
      setUserInfo({
        id: data.id || "",
        username: data.username || "",
        name: data.name || "",
        nickname: data.nickname || ""
      });
      setOriginalNickname(data.nickname || "");
    } catch (err) {
      console.error("회원 정보 불러오기 실패:", err);
      setError("회원 정보를 불러오는데 실패했습니다.");
    }
  };

  const handleNicknameChange = (e) => {
    setUserInfo(prev => ({
      ...prev,
      nickname: e.target.value
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

    // 비밀번호를 입력한 경우 일치 여부 확인
    if (newPassword || confirmPW) {
      if (newPassword !== confirmPW) {
        setError("비밀번호가 일치하지 않습니다.");
        return;
      }
    }

    setLoading(true);

    try {
      const updatePromises = [];
      
      // 비밀번호 또는 닉네임 변경 (change-info API)
      const isPasswordChanged = newPassword && newPassword.trim() !== "";
      const isNicknameChanged = userInfo.nickname !== originalNickname;

      if (isPasswordChanged || isNicknameChanged) {
        const changeInfoData = {};
        if (isPasswordChanged) {
          changeInfoData.password = newPassword;
        }
        if (isNicknameChanged) {
          changeInfoData.nickname = userInfo.nickname;
        }
        updatePromises.push(memberService.changeInfo(changeInfoData));
      }

      // 모든 API 호출이 없으면 알림
      if (updatePromises.length === 0) {
        setError("변경된 내용이 없습니다.");
        setLoading(false);
        return;
      }

      // 모든 변경사항 한 번에 처리
      await Promise.all(updatePromises);
      
      alert("회원정보가 수정되었습니다.");
      
      // 비밀번호 필드 초기화
      setNewPassword("");
      setConfirmPw("");
      setMatch("");

      // 스토어의 사용자 정보 업데이트
      setCurrentUser({
        ...currentUser,
        nickname: userInfo.nickname
      });

      // 사용자 정보 다시 불러오기
      await loadMemberInfo();
      
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError("회원정보 수정 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 회원 삭제
  const handleDeleteAccount = async () => {
  const ok = window.confirm(
    "정말 회원탈퇴 하시겠습니까?\n탈퇴 시 모든 정보가 삭제됩니다."
  );
  if (!ok) return;

  try {
    await memberService.deleteMember(currentUser.id);

    alert("회원탈퇴가 완료되었습니다.");

    // 로그아웃 처리
    setCurrentUser(null);
    localStorage.clear();

    // 로그인 페이지로 이동
    window.location.href = "/login";
  } catch (err) {
    console.error(err);
    alert("회원탈퇴 중 오류가 발생했습니다.");
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

        {/* 닉네임 (수정 가능) */}
        <div className="mb-3">
          <label className="form-label">닉네임</label>
          <input
            type="text"
            name="nickname"
            className="form-control"
            value={userInfo.nickname}
            onChange={handleNicknameChange}
          />
        </div>

        {/* 새 비밀번호 */}
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            새 비밀번호 (변경 시에만 입력)
          </label>
          <input
            type="password"
            id="newPassword"
            className="form-control"
            value={newPassword}
            onChange={handleNewPasswordChange}
            autoComplete="new-password"
            placeholder="변경하지 않으려면 비워두세요"
          />
        </div>

        {/* 새 비밀번호 확인 */}
        {newPassword && (
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
            />
          </div>
        )}

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

        <button 
          type="submit" 
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "수정 중..." : "회원정보 수정"}
        </button>
      </form>
      <button className="secession-btn" onClick={handleDeleteAccount}>회원탈퇴</button>
    </div>
  );
}