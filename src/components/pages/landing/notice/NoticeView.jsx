import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useUserStore from '../../../store/useUserStore';
import noticeService from '../../../services/notice.service';
import './Notice.css';


export default function NoticeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const currentUser = useUserStore((state) => state.user);

  useEffect(() => {
    if (!currentUser?.id) {
      alert('공지사항을 보려면 로그인해야 합니다.');
      navigate('/login');
      return;
    }
    const fetchNotice = async () => {
      try {
        const res = await noticeService.getNotice(id);
        setNotice(res.data);
      } catch (err) {
        console.log(err);
        alert('공지사항을 불러오는 중 오류가 발생했습니다.');
        navigate('/notice/list');
      }
    };

    fetchNotice();
  }, [id, currentUser, navigate]);

  if (!notice) return null;

  return (
    <>
      <div className="container mt-4">
        <div className="notice-layout">
          <div className="notice-card">
            <h3 className="notice-title">{notice.title}</h3>
            <p className="notice-date">작성일 : {notice.createTime?.substring(0, 10)}</p>
            <div className="notice-content">{notice.content}</div>
            <div className="notice-actions">

              <div className="notice-actions notice-actions-right">
                <button className="btn btn-notice-outline" onClick={() => navigate(`/notice/edit/${notice.id}`)}>
                  수정
                </button>
                <button
                  className="btn btn-notice-danger"
                  onClick={() => {
                    if (!window.confirm('삭제할까요?')) return;
                    // TODO: 실제 삭제 API 연결
                    // await noticeService.deleteNotice(notice.id);
                    navigate('/notice/list');
                  }}
                >
                  삭제
                </button>
              </div>

              <button className="btn btn-notice-back mt-3" onClick={() => navigate('/notice/list')}>
                목록으로
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
