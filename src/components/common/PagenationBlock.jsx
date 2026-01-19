export default function PaginationBlock({
  page,
  totalPages,
  onPageChange,
  maxButtons = 10,
  className = "",
}) {
  const currentBlock = Math.floor((page - 1) / maxButtons);
  const startPage = currentBlock * maxButtons + 1;
  const endPage = Math.min(startPage + maxButtons - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  const handlePrevBlock = () => {
    const prevBlockLastPage = startPage - 1;
    if (prevBlockLastPage >= 1) onPageChange(prevBlockLastPage);
  };

  const handleNextBlock = () => {
    const nextBlockFirstPage = endPage + 1;
    if (nextBlockFirstPage <= totalPages) onPageChange(nextBlockFirstPage);
  };

  return (
    <nav className={`pagination-block ${className}`} aria-label="Page navigation">
      <ul className="pagination justify-content-center">

        {/* 10 page 앞 */}
        {startPage > 1 && (
          <li className="page-item">
            <button className="page-link" type="button" onClick={handlePrevBlock}>
              이전
            </button>
          </li>
        )}

        {pages.map((p) => (
          <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
            <button className="page-link" type="button" onClick={() => onPageChange(p)}>
              {p}
            </button>
          </li>
        ))}

        {/* 10 page 뒤 */}
        {endPage < totalPages && (
          <li className="page-item">
            <button className="page-link" type="button" onClick={handleNextBlock}>
              다음
            </button>
          </li>
        )}

      </ul>
    </nav>
  );
}
