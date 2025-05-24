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
    { key: 'defesa', label: 'DEFESA' },
  ];

  return (
    <div className="hidden lg:grid grid-cols-4 gap-2 xl:my-6">
      {categories.map((category) => (
        <button
          key={category.key}
          className={`py-3 px-4 rounded-md text-center font-bold italic uppercase text-lg tracking-[-1px] transition-all ${
            selectedCategory === category.key
              ? 'bg-[#FFE500] text-[#18187c] border border-[#18187c]'
              : 'bg-[#18187c] text-[#FFE500] hover:scale-105'
          }`}
          onClick={() => onSelectCategory(category.key)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};