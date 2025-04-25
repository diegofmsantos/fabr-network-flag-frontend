import React from 'react';

interface StatCategoryButtonsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const StatCategoryButtons: React.FC<StatCategoryButtonsProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const categories = [
    { key: 'passe', label: 'PASSE' },
    { key: 'corrida', label: 'CORRIDA' },
    { key: 'recepcao', label: 'RECEPÇÃO' },
    { key: 'retorno', label: 'RETORNO' },
    { key: 'defesa', label: 'DEFESA' },
    { key: 'chute', label: 'CHUTE' },
    { key: 'punt', label: 'PUNT' }
  ];

  return (
    <div className="hidden lg:grid grid-cols-4 gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category.key}
          className={`py-3 px-4 rounded-md text-center font-bold italic uppercase text-lg tracking-[-1px] transition-all ${
            selectedCategory === category.key
              ? 'bg-[#63E300] text-black'
              : 'bg-[#373740] text-white hover:bg-gray-700'
          }`}
          onClick={() => onSelectCategory(category.key)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};