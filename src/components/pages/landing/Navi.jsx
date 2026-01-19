import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { Role } from "../../models/Role"
import "./Navi.css"
import useUserStore from "../../store/useUserStore"
// import logo from "../../../assets/cashtalk.svg";
import { useEffect, useState } from "react";

export default function Navi(){
  const currentUser = useUserStore((state)=>state.user)
  const navigate = useNavigate()
  const logout = () =>{
    const clearCurrentUser = useUserStore.getState().clearCurrentUser
    clearCurrentUser()
    setTimeout(()=>{
      navigate('/home')
    },100)
  }
  /* 네비 이벤트 */
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isMain = location.pathname === "/main"; 

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return(<>
    <nav className={`top-navi 
          ${scrolled ? "scrolled" : ""} 
          ${isMain ? "main" : "sub"}
    `}>
      <div className="inner">
        <div className="leftBox">
          <h1>
            로고로고
            {/* <img src={logo} alt="" /> */}
          </h1>
          <ul className="gnb">
            <li>
              <Link to='/notice/list' className=''>
                  공지사항
              </Link>
            </li>
            <li>
              <Link to='' className=''>
                  커뮤니티
              </Link>
            </li>
          </ul>
        </div>
        <div className="rightBox">
          {!currentUser&&
            <div className='rightBox'>
            <ul>
              <li className=''>
                  <Link to='/login' className=''>
                    로그인
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link to='/register' className=''>
                    회원가입
                  </Link>
                </li>                 
            </ul>
            </div>
          }
          {currentUser&&
            <div className=''>
              <ul>
                <li className=''>
                  <NavLink to='/dashboard/main' className=''>
                    {currentUser.name}
                  </NavLink>
                </li>
                <li className=''>
                  <a href='#' className='' onClick={logout}>
                    로그아웃
                  </a>
                </li>            
              </ul>
            </div>
          }
        </div>
      </div>
    </nav>
  </>)
}