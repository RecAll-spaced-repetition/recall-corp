import { IoSearch } from 'react-icons/io5';
import React, { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Button } from './Button';

export interface SearchBarProps {
  searchTerm: string;
  placeholder?: string;
  setSearchTerm: (term: string) => void;
  activeSearch: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  activeSearch,
  placeholder,
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const resultRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prevIndex) =>
        Math.min(prevIndex + 1, activeSearch.length - 1)
      );
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      const selected = activeSearch[highlightedIndex];
      setSearchTerm(selected);
      setHighlightedIndex(-1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setHighlightedIndex(-1);
    }
  };

  const handleItemClick = (item: string) => {
    setSearchTerm(item);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      resultsContainerRef.current &&
      !resultsContainerRef.current.contains(e.target as Node)
    ) {
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const scrollToHighlighted = (index: number) => {
    resultRefs.current[index]?.scrollIntoView({
      block: 'nearest',
    });
  };

  useEffect(() => {
    scrollToHighlighted(highlightedIndex);
  }, [highlightedIndex]);

  return (
    <div className="relative w-[500px] min-w-[250px] max-w-full">
      <div className="relative">
        <input
          type="search"
          placeholder={placeholder}
          className={clsx(
            'w-full h-12 p-4 rounded-full',
            'bg-transparent border-2 border-o-black',
            'transition-all duration-200',
            'hover:shadow-md hover:shadow-blue-200',
            'focus:outline-hidden focus:shadow-blue-200'
          )}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setHighlightedIndex(Math.min(0, activeSearch.length - 1));
          }}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="inline"
          className="absolute right-1 h-10 w-10 top-1 rounded-r-full rounded-l-full"
        >
          <IoSearch />
        </Button>
      </div>

      {highlightedIndex >= 0 && searchTerm && activeSearch.length > 0 && (
        <div
          ref={resultsContainerRef}
          className={clsx(
            'z-50',
            'absolute top-20',
            'border-2 border-o-black text-o-black',
            'bg-o-white shadow-lg',
            'w-full max-h-75',
            'rounded-xl p-4 overflow-auto',
            'grid grid-cols-1 gap-2',
            'transition-all duration-400'
          )}
        >
          {activeSearch.map((item, index) => (
            <div
              ref={(el) => {
                resultRefs.current[index] = el;
              }}
              key={index}
              className={clsx(
                'flex justify-between items-center p-2 cursor-pointer',
                highlightedIndex === index && 'bg-blue-200 rounded-[5px]'
              )}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => handleItemClick(item)}
            >
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
