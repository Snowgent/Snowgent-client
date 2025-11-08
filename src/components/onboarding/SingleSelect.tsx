const defaultOptions = [
  { id: 1, name: '식품 소분업' },
  { id: 2, name: '기타식품판매업' },
  { id: 3, name: '일반음식점' },
  { id: 4, name: '휴게음식점' },
  { id: 5, name: '제과점' },
  { id: 6, name: '단란주점/유흥주점' },
  { id: 7, name: '즉석판매제조·가공업' },
];

const SingleSelect = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* 제목 */}
      <p className="text-[24px] font-semibold">{title} 선택하세요</p>
      {/* 단일 선택 버튼 */}
      <select className="rounded-xl border border-gray-200 px-2 py-4 text-[20px] outline-none focus:border-gray-200">
        <option className="" value="">
          선택하세요
        </option>
        {defaultOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SingleSelect;
