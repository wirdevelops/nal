'use client';

import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}: PaginationProps) => (
  <div className={`flex justify-center gap-2 ${className}`}>
    {Array.from({ length: totalPages }, (_, i) => (
      <Button
        key={i + 1}
        variant={currentPage === i + 1 ? 'default' : 'outline'}
        onClick={() => onPageChange(i + 1)}
      >
        {i + 1}
      </Button>
    ))}
  </div>
);