import { Route, Routes } from 'react-router-dom'
import TopNavi from './components/topnavi/TopNavi'
import Home from './components/pages/home/Home'
import NotFound from './components/pages/error/NotFound'
import UnAuthorized from './components/pages/error/UnAuthorized'
import Profile from './components/pages/member/Profile'
import Login from './components/pages/member/Login'
import Register from './components/pages/member/Register'
import TransactionWrite from './components/pages/transaction/TransactionWrite'
import TransactionList from './components/pages/transaction/TransactionList'
import TransactionStats from './components/pages/transaction/TransactionStats'
import NoticeList from './components/pages/notice/NoticeList'
import NoticeView from './components/pages/notice/NoticeView'
import Admin from './components/pages/admin/Admin'
import NoticeWrite from './components/pages/admin/NoticeWrite'
import NoticeEdit from './components/pages/admin/NoticeEdit'
import PasswordAuth from './components/pages/member/user/PasswordAuth'
import MemberDelete from './components/pages/member/user/MemberDelete'
import ChangePassword from './components/pages/member/user/ChangePassword'
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css'
import PrivateRoute from './components/routes/PrivateRoute'

function App() {


  return (
    <>
      <TopNavi/>
      <Routes>
        {/* 로그인 없어도 가능한 페이지 */}
        <Route path='/' element={<Home/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/notice/list' element={<NoticeList/>}/>

        {/* 로그인 필요하지만 누르면 알아서 로그인 창으로 이동하게 함 */}
        <Route path='/notice/view/:id' element={<NoticeView/>}/>


        {/* 로그인 필요 페이지 */}
        <Route path='/admin' element={<PrivateRoute><Admin/></PrivateRoute>}/>
        <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>}/>
        <Route path='/transaction/write' element={<PrivateRoute><TransactionWrite/></PrivateRoute>}/>
        <Route path='/transaction/list' element={<PrivateRoute><TransactionList/></PrivateRoute>}/>
        <Route path='/transaction/stats' element={<PrivateRoute><TransactionStats/></PrivateRoute>}/>
        <Route path='/notice/write' element={<PrivateRoute><NoticeWrite/></PrivateRoute>}/>
        <Route path='/notice/edit/:id' element={<PrivateRoute><NoticeEdit/></PrivateRoute>}/>
        <Route path='/auth/password' element={<PrivateRoute><PasswordAuth/></PrivateRoute>}/>
        <Route path='/member/delete' element={<PrivateRoute><MemberDelete/></PrivateRoute>}/>
        <Route path='/member/change-password' element={<PrivateRoute><ChangePassword/></PrivateRoute>}/>

        {/* 에러 페이지 */}
        <Route path='/404' element={<NotFound/>}/>
        <Route path='*' element={<NotFound/>}/>
        <Route path='/401' element={<UnAuthorized/>}/>
      </Routes>
    </>
  )
}

export default App
