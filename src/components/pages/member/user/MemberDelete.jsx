import { useNavigate } from "react-router-dom";
import memberService from "../../../services/member.service";
import useUserStore from "../../../store/useUserStore";

export default function MemberDelete() {
  const currentUser = useUserStore((state) => state.user);
  const mid = currentUser?.id;
  const navigate = useNavigate();
  const clearCurrentUser = useUserStore((state)=>state.clearCurrentUser)

  const handleDelete = async () => {
    const ok = window.confirm("정말로 회원을 탈퇴하시겠습니까?");
    if (!ok) return;

    try {
      await memberService.deleteMember(mid);
      alert("회원 탈퇴가 완료되었습니다.");
      clearCurrentUser();
      setTimeout(()=>{
        navigate("/");
      },100)
    } catch (err) {
      console.log(err);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>회원 탈퇴</h3>
      <p>회원 탈퇴 시 계정과 모든 데이터가 삭제됩니다.</p>
      <button className="btn btn-danger" onClick={handleDelete}>
        탈퇴하기
      </button>
    </div>
  );
}
