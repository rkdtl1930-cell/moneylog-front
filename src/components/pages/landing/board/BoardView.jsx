import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../../store/useUserStore";
import boardService from "../../../services/board.service";

export default function BoardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useUserStore((s) => s.user);

  const [board, setBoard] = useState(null);

  useEffect(() => {
    if (!currentUser?.id) {
      alert("게시글을 보려면 로그인해야 합니다.");
      navigate("/login");
      return;
    }

    const fetchBoard = async () => {
      try {
        const res = await boardService.getBoard(id);
        setBoard(res.data);
      } catch (err) {
        console.log(err);
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
        navigate("/board/list");
      }
    };

    fetchBoard();
  }, [id, currentUser, navigate]);

  if (!board) return null;

  return (
    <div className="container mt-4">
      <div className="notice-card">
        <h3 className="notice-title">{board.title}</h3>
        <p className="notice-date">작성일 : {board.createTime?.substring(0, 10)}</p>

        {/* 이미지가 있으면 표시 */}
        {board.imageUrl && (
          <div style={{ margin: "16px 0" }}>
            <img
              src={board.imageUrl}
              alt="첨부 이미지"
              style={{ maxWidth: "100%", borderRadius: 8 }}
            />
          </div>
        )}

        <div className="notice-content">{board.content}</div>

        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-secondary" onClick={() => navigate("/board/list")}>
            목록으로
          </button>

          {/* 필요하면 수정 버튼 */}
          <button className="btn btn-primary" onClick={() => navigate(`/board/modify/${id}`)}>
            수정
          </button>
        </div>
      </div>
    </div>
  );
}
