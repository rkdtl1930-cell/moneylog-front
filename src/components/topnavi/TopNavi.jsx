import { Link, NavLink, useNavigate } from "react-router-dom"
import useUserStore from "../store/useUserStore"
import { Role } from "../models/Role"
import "./TopNavi.css"

export default function TopNavi(){
  const currentUser = useUserStore((state)=>state.user)
  const navigate = useNavigate()
  const logout = () =>{
    const clearCurrentUser = useUserStore.getState().clearCurrentUser
    clearCurrentUser()
    setTimeout(()=>{
      navigate('/home')
    },100)
  }

  return(<>
    <nav className="navbar navbar-expand my-navbar">
      <div className='navbar-nav'>
        <li className='nav-item'>
          <NavLink to="/" className='nav-link'>머니로그</NavLink>
        </li>
        <li className='nav-item'>
          <NavLink to="/notice/list" className='nav-link'>공지사항</NavLink>
        </li>
      
        <li className='nav-item'>
          <NavLink to="/admin" className='nav-link'>관리자</NavLink>
        </li>             
        
        <li className='nav-item'>
          <NavLink to="/transaction/write" className='nav-link'>내역 작성</NavLink>
        </li>
        <li className='nav-item'>
          <NavLink to="/transaction/list" className='nav-link'>내역 목록</NavLink>
        </li>
        <li className='nav-item'>
          <NavLink to="/transaction/stats" className='nav-link'>내역 통계</NavLink>
        </li>
          
      </div>
      {!currentUser&&
        <div className='navbar-nav ms-auto me-5'>
          <li className='nav-item'>
            <Link to='/login' className='nav-link'>
              로그인
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/register' className='nav-link'>
              회원가입
            </Link>
          </li>
        </div>
      }
      {currentUser&&
        <div className='navbar-nav ms-auto me-5'>
          <li className='nav-item'>
            <NavLink to='/profile' className='nav-link'>
              {currentUser.name}
            </NavLink>
          </li>
          <li className='nav-item'>
            <a href='#' className='nav-link' onClick={logout}>
              로그아웃
            </a>
          </li>
        </div>
      }
    </nav>
  </>)
}