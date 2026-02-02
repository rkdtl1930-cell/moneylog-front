import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function UnAuthorized(){
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
        <h1>401</h1>
        <div className="char-container">
          <img 
            src={`/images/sub/ui-char0${currentImage}.svg`} 
            alt="" 
            className="char"
          />
        </div>
        <h2>로그인이 필요한 페이지입니다.</h2>
        <p>로그인 후 이용해주세요..</p>
        <a href="/login">로그인으로</a>
      </div>
    </div>
  )
}
export default UnAuthorized;