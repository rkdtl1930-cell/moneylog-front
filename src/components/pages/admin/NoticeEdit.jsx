import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import noticeService from '../../services/notice.service';
import '../landing/notice/Notice.css';

export default function NoticeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await noticeService.getNotice(id);
        setTitle(res.data.title ?? '');
        setContent(res.data.content ?? '');
      } catch (err) {
        console.log(err);
        alert('공지사항 정보를 불러오는 데 실패했습니다.');
        navigate('/admin');
      }
    };
    fetchNotice();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await noticeService.updateNotice(id, { title, content });
      alert('공지사항이 수정되었습니다.');
      navigate('/notice/list');
    } catch (err) {
      console.log(err);
      alert('공지사항 수정에 실패했습니다.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="notice-layout">
        <div className="notice-card">
          <div className="notice-header">
            <img src="/images/dashboard/icons/write-on.svg" alt="공지사항 수정" className="notice-icon" />
            <h3 className="notice-title notice-write-title">공지사항 수정</h3>
          </div>

          <form onSubmit={handleUpdate}>
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
                수정
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
