import { useState } from 'react';

const PriceInput = ({ title, placeholder }: { title: string; placeholder?: string }) => {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 입력 가능하도록
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setValue(numericValue);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 제목 */}
      <p className="text-[24px] font-semibold">{title}을 입력해주세요</p>

      {/* 입력칸 */}
      <div className="relative flex items-center rounded-xl border border-gray-200">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder || '0'}
          className="flex-1 rounded-xl px-4 py-4 text-[20px] outline-none"
        />
        <span className="pointer-events-none pr-4 text-[20px] text-gray-500">만원</span>
      </div>
    </div>
  );
};

export default PriceInput;
