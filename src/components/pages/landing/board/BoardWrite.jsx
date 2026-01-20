import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../../store/useUserStore';
import boardService from '../../../services/board.service';

import { uploadFileToFirebase, deleteFileUrl } from '../../../../storage/firebaseStorage.jsx';

export default function BoardWrite() {
  const navigate = useNavigate();
  const currentUser = useUserStore((s) => s.user);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser?.id) {
      alert('글 작성은 로그인 후 가능합니다.');
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    e.target.value = '';
  };

  const handleRemoveFile = () => setFile(null);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목/내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    let imageUrl = null;

    try {
      if (file) {
        imageUrl = await uploadFileToFirebase(file, 'board');
        console.log('firebase upload url:', imageUrl);
      }

      await boardService.createBoard({ title, content, imageUrl });

      alert('등록 완료!');
      navigate('/board/list');
    } catch (err) {
      console.log('createBoard error:', err?.response?.status, err?.response?.data, err);

      // 업로드만 되고 서버 저장 실패하면 롤백 삭제
      if (imageUrl) {
        try {
          await deleteFileUrl(imageUrl);
          console.log('rollback delete success');
        } catch (e) {
          console.log('rollback delete failed:', e);
        }
      }

      alert('게시글 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="board-write container mt-4">
      <div className="board-write__card notice-card">
        <div className="board-write__header">
          <h3 className="board-write__title notice-title">자유게시판 글쓰기</h3>
        </div>

        <div className="board-write__field">
          <label className="board-write__label">제목</label>
          <input
            className="board-write__input form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            disabled={isSubmitting}
          />
        </div>

        <div className="board-write__field">
          <label className="board-write__label">내용</label>
          <textarea
            className="board-write__textarea form-control"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            disabled={isSubmitting}
          />
        </div>

        <div className="board-write__field">
          <label className="board-write__label">첨부 이미지</label>

          <input
            id="board-attach"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={isSubmitting}
          />

          <div className="board-write__file-row">
            <label
              htmlFor="board-attach"
              className={`board-write__file-btn btn btn-outline-secondary ${isSubmitting ? 'disabled' : ''}`}
              style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              이미지 선택
            </label>

            <div className="board-write__file-meta">
              {file && (
                <>
                  <span className="board-write__file-name">{file.name}</span>
                  <button
                    type="button"
                    className="board-write__file-remove btn btn-sm btn-link"
                    onClick={handleRemoveFile}
                    disabled={isSubmitting}
                  >
                    제거
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="board-write__actions mt-3">
          <button
            type="button"
            className="board-write__submit btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '등록'}
          </button>

          <button
            type="button"
            className="board-write__cancel btn btn-secondary"
            onClick={() => navigate('/board/list')}
            disabled={isSubmitting}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
