import { useEffect, useState, useCallback } from 'react';
import memberService from '../../../services/member.service';
import './Content.css';
import Popup from '../popup/Popup';
import useUserStore from '../../../store/useUserStore';

export default function AdminPage() {
  const currentUser = useUserStore((state) => state.user);
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // 팝업 관련 state
  const [showEdit, setShowEdit] = useState(false);
  const [targetMember, setTargetMember] = useState(null);
  const [role, setRole] = useState('');

  // 회원 목록 조회
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await memberService.getMembers({ page, size });
      setMembers(res.data.dtoList || []);
      setTotalPages(Math.ceil((res.data.total || 0) / size));
    } catch (e) {
      console.error('회원 목록 조회 실패:', e);
      alert('회원 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // 팝업 열기
  const openPopup = (member) => {
    setTargetMember(member);
    setRole(member.role);
    setShowEdit(true);
  };

  // 팝업 닫기
  const closePopup = () => {
    setShowEdit(false);
    setTargetMember(null);
    setRole('');
  };

  // 권한 변경
  const handleChangeRole = async () => {
    if (!targetMember || role === targetMember.role) {
      closePopup();
      return;
    }

    try {
      await memberService.changeRole(role, targetMember.username);
      alert('권한이 변경되었습니다.');
      closePopup();
      fetchMembers();
    } catch (e) {
      console.error('권한 변경 실패:', e);
      alert(e.response?.data?.message || '권한 변경에 실패했습니다.');
    }
  };

  // 페이지네이션
  const maxButtons = 5;
  const currentBlock = Math.floor((page - 1) / maxButtons);
  const startPage = currentBlock * maxButtons + 1;
  const endPage = Math.min(startPage + maxButtons - 1, totalPages);
  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  const handlePrevBlock = () => {
    if (startPage > 1) setPage(startPage - 1);
  };
  const handleNextBlock = () => {
    if (endPage < totalPages) setPage(endPage + 1);
  };

  return (
    <>
      <h1>회원관리</h1>

      <div className="admin-page dash-board-con">
        <div className="card">
          {loading ? (
            <p>로딩 중...</p>
          ) : (
            <>
              <table className="common-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>아이디</th>
                    <th>이름</th>
                    <th>닉네임</th>
                    <th>권한</th>
                    <th>관리</th>
                  </tr>
                </thead>

                <tbody>
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan="6">회원이 없습니다.</td>
                    </tr>
                  ) : (
                    members.map((m) => (
                      <tr key={m.id}>
                        <td>{m.id}</td>
                        <td>{m.username}</td>
                        <td>{m.name}</td>
                        <td>{m.nickname}</td>
                        <td className={m.role === 'ADMIN' ? 'admin' : 'user'}>
                          <span>{m.role}</span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm"
                            onClick={() => openPopup(m)}
                            disabled={currentUser?.username === m.username}
                          >
                            변경
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {(members.length > 0 || totalPages > 1) && (
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center">
                    {startPage > 1 && (
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
              )}

            </>
          )}
        </div>
      </div>

      {/* 권한 변경 팝업 */}
      <Popup open={showEdit} onClose={closePopup}>
        <div className="popup-header">
          <h3><strong>{targetMember?.username}</strong> ({targetMember?.name}) 권한변경</h3>
          <button className="close-btn" onClick={closePopup}><img src="/images/dashboard/ico-close.svg" alt="" /></button>
        </div>

        <div className="popup-body">
          <div className="form-group">
            <label>권한 변경</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>

        <div className="popup-footer">
          <button className="btn close" onClick={closePopup}>취소</button>
          <button className="btn primary" onClick={handleChangeRole}>
            변경
          </button>
        </div>
      </Popup>
    </>
  );
}
