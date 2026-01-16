import { Link } from "react-router-dom";

export default function NotFound(){
  return(<>
    <div className="container">
      <div className="row">
        <div className="col-md-12 text-center">
          <span className="display-1">404</span>
          <div className="mb-4 lead">주소가 변경되었거나 페이지를 찾지 못했습니다</div>
          <Link to='/home' className="btn btn-link">Back to Home</Link>
        </div>
      </div>
    </div>
  </>)
}