import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import boardService from "../../../services/board.service";

export default function BoardList() {
  const [boards, setBoards] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await boardService.getBoards(page, size);
      setBoards(res.data.dtoList || []);
      setTotalPages(Math.ceil(res.data.total / size));
    } catch (err) {
      console.log(err);
      setBoards([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      fetchData();
    };
    fetch();
  }, [page]);

  // 노티스랑 똑같은 페이지 블럭 로직
  const maxButtons = 5;
  const currentBlock = Math.floor((page - 1) / maxButtons);
  const startPage = currentBlock * maxButtons + 1;
  const endPage = Math.min(startPage + maxButtons - 1, totalPages);
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handlePrevBlock = () => {
    const prevBlockLastPage = startPage - 1;
    if (prevBlockLastPage >= 1) setPage(prevBlockLastPage);
  };

  const handleNextBlock = () => {
    const nextBlockFirstPage = endPage + 1;
    if (nextBlockFirstPage <= totalPages) setPage(nextBlockFirstPage);
  };

  // 첨부 여부: DTO 필드명 확정되면 하나만 남기면 됨
  const hasAttachment = (b) => {
    return (
      (typeof b.attachmentCount === "number" && b.attachmentCount > 0) ||
      b.hasAttachment === true ||
      b.hasFile === true ||
      (Array.isArray(b.fileUrls) && b.fileUrls.length > 0) ||
      (typeof b.fileUrl === "string" && b.fileUrl.length > 0)
    );
  };

  return (
    <div className="container mt-4">
      <h3>자유게시판</h3>

      <div className="d-flex jusify-content-between align-items-center mb-3">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>첨부</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
              <th>좋아요</th>
            </tr>
          </thead>

          <tbody>
            {boards.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  게시글이 없습니다.
                </td>
              </tr>
            ) : (
              boards.map((b) => (
                <tr
                  key={b.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/board/view/${b.id}`)}
                >
                  <td>{b.id}</td>
                  <td>{b.title}</td>

                  {/* 첨부파일 마크 칸 */}
                  <td>{hasAttachment(b) ? "Y" : ""}</td>

                  <td>{b.writer}</td>
                  <td>{b.createTime?.substring(0, 10)}</td>

                  {/* 조회수/좋아요: DTO 필드명 맞춰 쓰면 됨 */}
                  <td>{b.viewCount ?? b.views ?? 0}</td>
                  <td>{b.likeCount ?? b.likes ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <button
          className="btn btn-info text-white"
          onClick={() => navigate("/board/write")}
        >
          글쓰기
        </button>
      </div>

      {/* 노티스랑 동일한 페이지네이션 UI */}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          {page > 1 && (
            <li className="page-item">
              <button className="page-link" onClick={handlePrevBlock}>
                이전
              </button>
            </li>
          )}

          {pages.map((p) => (
            <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
              <button className="page-link" onClick={() => setPage(p)}>
                {p}
              </button>
            </li>
          ))}

          {endPage < totalPages && (
            <li className="page-item">
              <button className="page-link" onClick={handleNextBlock}>
                다음
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
