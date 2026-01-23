import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import noticeService from '../../services/notice.service';
import '../landing/notice/Notice.css';

export default function NoticeWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    try {
      await noticeService.createNotice({ title, content });
      alert('공지사항이 등록되었습니다.');
      navigate('/notice/list');
    } catch (err) {
      console.log(err);
      alert('공지사항 등록 중 오류가 발생했습니다.');
    }
  };
  return (
    <div className="container mt-4">
      <div className="notice-layout">
        <div className="notice-card">
          <h3 className="notice-title">공지사항 작성</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">제목</label>
              <input
                type="text"
                className="form-control notice-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">내용</label>
              <textarea
                className="form-control notice-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="내용을 입력하세요"
              />
            </div>

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-notice-primary">
                등록
              </button>
              <button type="button" className="btn btn-notice-outline" onClick={() => navigate('/notice/list')}>
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
