const MultiSelect = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* 제목 */}
      <p className="text-[24px] font-semibold">{title}을 선택하세요</p>
      {/* 입력칸 */}
      <input type="text" className="rounded-xl border border-gray-200 px-2 py-4 text-[20px]" />
    </div>
  );
};

export default MultiSelect;
