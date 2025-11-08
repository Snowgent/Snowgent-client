const FormButton = ({ type, onClick }: { type: string; onClick: () => void }) => {
  const buttonStyle =
    'bg-[#0D2D84] w-full text-white py-3 rounded-lg text-center font-medium cursor-pointer';

  const grayButtonStyle =
    'bg-gray-300 w-full text-gray-700 py-3 rounded-lg text-center font-medium cursor-pointer';

  const handleClick = () => {
    onClick();
  };

  switch (type) {
    case 'next':
      return (
        <div className={buttonStyle} onClick={handleClick}>
          다음
        </div>
      );

    case 'prev':
      return (
        <div className={grayButtonStyle} onClick={handleClick}>
          이전
        </div>
      );

    case 'submit':
      return (
        <div className={buttonStyle} onClick={handleClick}>
          완료
        </div>
      );

    default:
      break;
  }
};

export default FormButton;
