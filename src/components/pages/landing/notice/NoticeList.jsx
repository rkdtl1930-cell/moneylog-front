import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import noticeService from '../../../services/notice.service';
import './Notice.css';
import Navi from '../Navi';
import useUserStore from '../../../store/useUserStore';

export default function NoticeList() {
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const currentUser = useUserStore((state) => state.user);
  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.isAdmin === true;

  const fetchData = async () => {
    try {
      const res = await noticeService.getNotices(page, size);
      console.log('공지사항 첫 번째:', res.data.dtoList?.[0]);
      console.log('paging raw:', res.data);
      console.log('page:', res.data.page, 'last:', res.data.last, 'total:', res.data.total);

      setNotices(res.data.dtoList || []);
      setTotalPages(res.data.last || 1);
    } catch (err) {
      console.log(err);
      setNotices([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      fetchData();
    };
    fetch();
  }, [page]);

  const maxButtons = 2;
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

  return (
    <div className="notice-page container mt-4">
      <Navi />
      <div className="notice-layout">
        {/* <div className="notice-head">
          <h3 className="notice-title">공지사항</h3>
        </div> */}

        <div className="notice-toolbar">
          {isAdmin && (
            <button className="btn btn-notice-primary" onClick={() => navigate('/notice/write')}>
              글쓰기
            </button>
          )}
        </div>
        <div className="notice-table-wrap">
          <table className="notice-table table table-bordered">
            <thead className="table-light">
              <tr>
                <th style={{ width: '10%' }} className="col-num">
                  번호
                </th>
                <th style={{ width: '60%' }} className="col-title">
                  제목
                </th>
                <th style={{ width: '30%' }} className="col-date">
                  작성일
                </th>
              </tr>
            </thead>
            <tbody>
              {notices.length === 0 ? (
                <tr>
                  <td colSpan="3" className="notice-empty text-center text-muted">
                    공지사항이 없습니다.
                  </td>
                </tr>
              ) : (
                notices.map((notice) => (
                  <tr key={notice.id} className="notice-row" onClick={() => navigate(`/notice/view/${notice.id}`)}>
                    <td className="col-num">{notice.id}</td>
                    <td className="col-title">{notice.title}</td>
                    <td className="col-date">{notice.createTime?.substring(0, 10)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <nav className="notice-pagination" aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            {startPage > 1 && (
              <li className="page-item">
                <button className="page-link" onClick={handlePrevBlock}>
                  이전
                </button>
              </li>
            )}
            {pages.map((p) => (
              <li key={p} className={`page-item ${page === p ? 'active' : ''}`}>
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
    </div>
  );
}
