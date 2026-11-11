import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronDown, X } from 'lucide-react';

export default function CategoryTreeFilter({ categories, excluded, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleExpand = (l1Name) => {
    setExpanded(prev => ({ ...prev, [l1Name]: !prev[l1Name] }));
  };

  const isExcluded = (path) => excluded.includes(path);

  const toggleCategory = (path) => {
    if (isExcluded(path)) {
      onChange(excluded.filter(p => p !== path));
    } else {
      onChange([...excluded, path]);
    }
  };

  const allPaths = [];
  categories.forEach(l1 => {
    allPaths.push(l1.name);
    (l1.children || []).forEach(l2 => {
      allPaths.push(`${l1.name}/${l2.name}`);
    });
  });

  const isAllExcluded = excluded.length === allPaths.length;
  const isNoneExcluded = excluded.length === 0;

  const toggleAll = () => {
    if (isAllExcluded) {
      onChange([]);
    } else {
      onChange([...allPaths]);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm w-full transition-colors ${
          !isNoneExcluded 
            ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
            : 'bg-[#0a0908] border-[#333] text-gray-300 hover:bg-[#1a1a1a]'
        }`}
      >
        <span>Категории {!isNoneExcluded && `(выбрано ${allPaths.length - excluded.length})`}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-[#141414] border border-[#333] rounded-xl p-3 shadow-2xl z-50">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#333]">
            <button onClick={toggleAll} className="text-xs text-blue-400 hover:underline">
              {isAllExcluded ? 'Включить все' : 'Исключить все'}
            </button>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
              <X size={16} />
            </button>
          </div>

          {categories.map(l1 => {
            const l2Items = l1.children || [];
            const isExpanded = expanded[l1.name];
            const isL1Excluded = isExcluded(l1.name);
            const allL2Excluded = l2Items.length > 0 && l2Items.every(l2 => isExcluded(`${l1.name}/${l2.name}`));
            const someL2Excluded = l2Items.some(l2 => isExcluded(`${l1.name}/${l2.name}`));

            return (
              <div key={l1.name} className="mb-1">
                <div className="flex items-center gap-2 py-1.5 hover:bg-[#1a1a1a] rounded px-2">
                  {l2Items.length > 0 ? (
                    <button onClick={() => toggleExpand(l1.name)} className="text-gray-500">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  ) : (
                    <span className="w-3.5" />
                  )}
                  <input
                    type="checkbox"
                    checked={!isL1Excluded && !allL2Excluded}
                    ref={el => {
                      if (el) el.indeterminate = !isL1Excluded && someL2Excluded && !allL2Excluded;
                    }}
                    onChange={() => toggleCategory(l1.name)}
                    className="w-4 h-4 rounded border-gray-600 bg-[#0a0908] checked:bg-blue-600 cursor-pointer"
                  />
                  <span className="text-sm text-gray-200 flex-1 cursor-pointer" onClick={() => toggleCategory(l1.name)}>{l1.name}</span>
                </div>

                {isExpanded && l2Items.length > 0 && (
                  <div className="ml-8 border-l border-[#333] pl-2">
                    {l2Items.map(l2 => {
                      const path = `${l1.name}/${l2.name}`;
                      return (
                        <div key={path} className="flex items-center gap-2 py-1.5 hover:bg-[#1a1a1a] rounded px-2">
                          <input
                            type="checkbox"
                            checked={!isExcluded(path)}
                            onChange={() => toggleCategory(path)}
                            className="w-4 h-4 rounded border-gray-600 bg-[#0a0908] checked:bg-blue-600 cursor-pointer"
                          />
                          <span className="text-sm text-gray-400 cursor-pointer" onClick={() => toggleCategory(path)}>{l2.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
