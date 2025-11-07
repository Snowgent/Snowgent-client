import { useState } from 'react';

interface MultiSelectProps {
  title: string;
  options?: string[];
}

const MultiSelect = ({
  title,
  options = ['10대 이하', '20대', '30대', '40대', '50대', '60대 이상'],
}: MultiSelectProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 제목 */}
      <p className="text-[24px] font-semibold">{title}을 선택하세요</p>
      {/* 6개 그리드 버튼 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => toggleOption(option)}
            className={`rounded-xl border-2 px-4 py-8 text-[18px] font-medium duration-200 ${
              selectedOptions.includes(option)
                ? 'border-[#0D2D84] bg-[#0D2D84] text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultiSelect;
