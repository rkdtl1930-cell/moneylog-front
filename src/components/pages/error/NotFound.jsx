import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import './ui.css'

function NotFound(){
  const [currentImage, setCurrentImage] = useState(1);
  
  useEffect(() => {
    const imageSequence = [1, 2, 1, 3]; 
    let index = 0;
    
    const interval = setInterval(() => {
      index = (index + 1) % imageSequence.length;
      setCurrentImage(imageSequence[index]);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="container uiBox notFound">
      <div>
        <h1>404</h1>
        <div className="char-container">
          <img 
            src={`/images/sub/ui-char0${currentImage}.svg`} 
            alt="" 
            className="char"
          />
        </div>
        <h2>페이지를 찾을 수 없습니다.</h2>
        <p>페이지 주소가 잘못 입력되었거나, 주소가 변경 또는 삭제되어<br/>
        요청하신 페이지를 찾을 수 없습니다.</p>
        <a href="/">메인으로</a>
      </div>
    </div>
  )
}
export default NotFound;