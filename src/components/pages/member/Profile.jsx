import { useState } from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import "./Profile.css"
import { useNavigate } from "react-router-dom";
import Budget from "../budget/Budget";

export default function Profile(){
  const [activeKey, setActiveKey] = useState("member");
  const navigate = useNavigate();
  return(<>
    <div className="container mt-4">
      <Tabs id="profile-tabs" activeKey={activeKey} onSelect={(k)=>setActiveKey(k)} className="mb-3" fill>
        <Tab eventKey="budget" title="예산">
          <Budget/>
        </Tab>
        <Tab eventKey="member" title="회원정보">
          <div className="mt-3">
            <h5>회원정보 관리</h5>
            <p>아래 버튼을 눌러 비밀번호 인증 후 진행할 수 있습니다.</p>
            <Button variant="primary" className="me-2" onClick={()=>navigate("/auth/password", { state: { to: "/member/change-password" }})}>비밀번호 변경</Button>
            <Button variant="danger" onClick={()=>navigate("/auth/password",{state:{to:"/member/delete"}})}>회원탈퇴</Button>
          </div>
        </Tab>
      </Tabs>
    </div>
  </>)
}