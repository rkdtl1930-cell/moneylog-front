import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../../store/useUserStore";
import boardService from "../../../services/board.service";

import { uploadFileToFirebase, deleteFileUrl } from "../../../../storage/firebaseStorage";

export default function BoardModify() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useUserStore((s) => s.user);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [file, setFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser?.id) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await boardService.getBoard(id);
        const data = res.data;
        setTitle(data.title ?? "");
        setContent(data.content ?? "");
        setExistingImageUrl(data.imageUrl ?? null);

        setRemoveImage(false);
        setFile(null);
      } catch (err) {
        console.log(err);
        alert("게시글을 불러올 수 없습니다.");
        navigate("/board/list");
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    if (selected) setRemoveImage(false);
    e.target.value = "";
  };

  const handleRemoveAttachment = () => {
    setRemoveImage(true);
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목/내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    let nextImageUrl = existingImageUrl;
    let uploadedNewUrl = null;

    try {
      // 기존 이미지 삭제 선택
      if (removeImage) nextImageUrl = null;

      // 새 파일 업로드로 교체
      if (file) {
        uploadedNewUrl = await uploadFileToFirebase(file, "board");
        nextImageUrl = uploadedNewUrl;
      }

      await boardService.updateBoard(id, {
        title,
        content,
        imageUrl: nextImageUrl,
      });

      // 성공 후 기존 이미지 삭제(삭제 선택 or 교체)
      if ((removeImage || file) && existingImageUrl) {
        try {
          await deleteFileUrl(existingImageUrl);
          console.log("old image delete success");
        } catch (e) {
          console.log("old image delete failed:", e);
        }
      }

      alert("수정 완료!");
      navigate(`/board/view/${id}`);
    } catch (err) {
      console.log("updateBoard error:", err?.response?.status, err?.response?.data, err);

      // 실패했는데 새 업로드가 됐다면 롤백 삭제
      if (uploadedNewUrl) {
        try {
          await deleteFileUrl(uploadedNewUrl);
          console.log("rollback delete success");
        } catch (e) {
          console.log("rollback delete failed:", e);
        }
      }

      alert("게시글 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputId = "board-modify-attach";

  return (
    <div className="board-modify container mt-4">
      <div className="board-modify__card notice-card">
        <div className="board-modify__header">
          <h3 className="board-modify__title notice-title">자유게시판 수정</h3>
        </div>

        <div className="board-modify__field">
          <label className="board-modify__label">제목</label>
          <input
            className="board-modify__input form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            disabled={isSubmitting}
          />
        </div>

        <div className="board-modify__field">
          <label className="board-modify__label">내용</label>
          <textarea
            className="board-modify__textarea form-control"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            disabled={isSubmitting}
          />
        </div>

        <div className="board-modify__field">
          <label className="board-modify__label">첨부 이미지</label>

          <input
            id={inputId}
            type="file"
            accept="image/*"
            className="board-modify__file-input d-none"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />

          <div className="board-modify__file-row">
            <label htmlFor={inputId} className="board-modify__file-btn btn btn-outline-secondary">
              이미지 선택
            </label>

            <div className="board-modify__file-meta">
              {file ? (
                <span className="board-modify__file-name">{file.name}</span>
              ) : existingImageUrl && !removeImage ? (
                <span className="board-modify__file-name">기존 이미지 있음</span>
              ) : removeImage ? (
                <span className="board-modify__file-name">기존 이미지 삭제 예정</span>
              ) : null}
            </div>

            <button
              type="button"
              className="board-modify__file-remove btn btn-sm btn-outline-danger"
              onClick={handleRemoveAttachment}
              disabled={isSubmitting || (!existingImageUrl && !file)}
            >
              첨부 제거
            </button>
          </div>
        </div>

        <div className="board-modify__actions mt-3">
          <button
            type="button"
            className="board-modify__submit btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </button>

          <button
            type="button"
            className="board-modify__cancel btn btn-secondary"
            onClick={() => navigate(`/board/view/${id}`)}
            disabled={isSubmitting}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
