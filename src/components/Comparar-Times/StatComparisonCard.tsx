import React from 'react';

interface StatComparisonCardProps {
  title: string;
  stat1: string;
  stat2: string;
  color1: string;
  color2: string;
}

export const StatComparisonCard: React.FC<StatComparisonCardProps> = ({
  title, 
  stat1, 
  stat2, 
  color1, 
  color2
}) => {
  // Determinar qual valor é maior para destacar
  const num1 = parseFloat(stat1.replace(/[^0-9.]/g, ''));
  const num2 = parseFloat(stat2.replace(/[^0-9.]/g, ''));

  const isFirstBetter = !isNaN(num1) && !isNaN(num2) && num1 > num2;
  const isSecondBetter = !isNaN(num1) && !isNaN(num2) && num2 > num1;
  const isEqual = num1 === num2;

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-bold mb-4 text-center">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        <div
          className={`p-3 rounded-md text-center font-bold text-2xl ${
            isFirstBetter ? 'bg-green-100' : isEqual ? 'bg-gray-100' : ''
          }`}
          style={{ color: color1 }}
        >
          {stat1}
        </div>
        <div
          className={`p-3 rounded-md text-center font-bold text-2xl ${
            isSecondBetter ? 'bg-green-100' : isEqual ? 'bg-gray-100' : ''
          }`}
          style={{ color: color2 }}
        >
          {stat2}
        </div>
      </div>
    </div>
  );
};