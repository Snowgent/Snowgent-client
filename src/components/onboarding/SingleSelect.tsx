const defaultOptions = [
  { id: 1, name: 'option1' },
  { id: 2, name: 'option2' },
  { id: 3, name: 'option3' },
  { id: 4, name: 'option4' },
  { id: 5, name: 'option5' },
  { id: 6, name: 'option6' },
  { id: 7, name: 'option7' },
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
