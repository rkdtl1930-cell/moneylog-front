import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Role } from '../../models/Role';
import './Navi.css';
import useUserStore from '../../store/useUserStore';
// import logo from "../../../assets/cashtalk.svg";
import logo from '../../../assets/w_logo.png';
import { useEffect, useState } from 'react';

export default function Navi() {
  const currentUser = useUserStore((state) => state.user)
  const clearCurrentUser = useUserStore((state) => state.clearCurrentUser);
    
  const navigate = useNavigate();

  const logout = () => {
    clearCurrentUser();
    setTimeout(() => {
      navigate('/home');
    }, 100);
  };

  /* 네비 이벤트 */
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isMain = location.pathname === '/' || location.pathname === '/home';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 🔥 디버깅: currentUser 상태 변화 확인
  useEffect(() => {
    console.log('Current User:', currentUser);
  }, [currentUser]);  

  return (
    <>
      <nav
        className={`top-navi 
          ${scrolled ? 'scrolled' : ''} 
          ${isMain ? 'main' : 'sub'}
    `}
      >
        <div className="inner">
          <div className="leftBox">
            <h1 className="logo">
              <Link to="/">
                <img src={logo} alt="TalkPay 로고" />
              </Link>
            </h1>
            <ul className="gnb">
              <li>
                <Link to="/notice/list" className="">
                  공지사항
                </Link>
              </li>
              <li>
                <Link to="/board/list" className="">
                  커뮤니티
                </Link>
              </li>
            </ul>
          </div>
          <div className="rightBox">
            {!currentUser && (
              <ul>
                <li className="">
                  <Link to="/login" className="">
                    로그인
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="">
                    회원가입
                  </Link>
                </li>
              </ul>
            )}
            {currentUser && (
              <ul>
                <li className="">
                  <NavLink to="/dashboard/main" className="">
                    {currentUser.name}
                  </NavLink>
                </li>
                <li className="">
                  <a href="#" className="" onClick={logout}>
                    로그아웃
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
