const TextInput = ({ title, placeholder }: { title: string; placeholder?: string }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* 제목 */}
      <p className="text-[24px] font-semibold">{title} 입력해주세요</p>
      {/* 입력칸 */}
      <input
        type="text"
        placeholder={placeholder}
        className="rounded-xl border border-gray-200 px-2 py-4 text-[20px] outline-none focus:border-gray-200"
      />
    </div>
  );
};

export default TextInput;
