import React from 'react';
import "../styles/pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        Anterior
      </button>
      {pages.map((page) => (
        <button key={page} className={page === currentPage ? 'active' : ''} onClick={() => onPageChange(page)}>
          {page}
        </button>
      ))}
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
