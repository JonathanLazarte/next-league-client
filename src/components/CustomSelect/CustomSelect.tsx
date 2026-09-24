'use client'

import React, { useState, useRef, useEffect } from 'react';
import type { Dispatch} from 'react'
import './CustomSelect.css';
import { FILTER_OPTIONS_BY_GROUPING, SKIN_FILTER_OPTIONS } from '@/utils/constants';
import type { ChampionGroupingOptionsValues, SkinGroupingOptionsValues, SortOptionsValues, ChampionSortOptions, ChampionGroupOptions } from '@/types/ui'
import type { SortOptions } from '@/types/ui';

type SkinFilterOptions = typeof SKIN_FILTER_OPTIONS
type ChampionFilterOptions = typeof FILTER_OPTIONS_BY_GROUPING[keyof typeof FILTER_OPTIONS_BY_GROUPING]//[number]["value"]
type OnChange =
  Dispatch<React.SetStateAction<SortOptionsValues | null>> |
  Dispatch<React.SetStateAction<SkinGroupingOptionsValues | null>> |
  Dispatch<React.SetStateAction<ChampionGroupingOptionsValues | null>>

interface CustomSelectProps {
  options: ChampionFilterOptions | SkinFilterOptions | SortOptions | ChampionSortOptions | ChampionGroupOptions,
  value: string | null,
  onChange: OnChange;
  placeholder: string,
  className: string,
  disabled?: boolean,
}

const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  disabled = false,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<HTMLDivElement[]>([]);

  // Encontrar la opción seleccionada
  const selectedOption = options?.find(option => option.value === value);

  // Manejar click fuera del select
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && event.target instanceof Node && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar navegación con teclado
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleOptionSelect(options[highlightedIndex]);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev =>
            prev < options.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev =>
            prev > 0 ? prev - 1 : options.length - 1
          );
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Manejar selección de opción
  const handleOptionSelect = (option: Record<string, any>) => {
    onChange(option.value);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Manejar click en el trigger
  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setHighlightedIndex(-1);
    }
  };

  // Scroll a la opción destacada
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex].scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div
      ref={selectRef}
      className={`custom-select ${className} ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
    >
      <div
        className="custom-select-trigger"
        onClick={handleTriggerClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={placeholder}
      >
        <span className="custom-select-value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {/*<span className={`custom-select-arrow ${isOpen ? 'open' : ''}`}>
          ▼
        </span>*/}
      </div>

      {isOpen && (
        <div className="custom-select-dropdown" role="listbox">
          {options?.map((option, index) => (
            <div
              key={option.value}
              ref={ el => {
                if (el !== null) optionRefs.current[index] = el
                }
              }
              className={`custom-select-option ${
                option.value === value ? 'selected' : ''
              } ${
                index === highlightedIndex ? 'highlighted' : ''
              }`}
              onClick={() => handleOptionSelect(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
