import { useNavigate } from 'react-router-dom';
import logo from '/vite.svg';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <img src={logo} alt="Vite logo" className="h-40" />
      <h1 className="text-6xl text-[#0D2D84]">Snowgent</h1>
      <button
        onClick={() => navigate('/onboarding')}
        className="cursor-pointer rounded-lg bg-blue-50 px-10 py-5 text-xl font-semibold text-[#0D2D84] hover:bg-blue-100"
      >
        시작하기
      </button>
    </div>
  );
};

export default Home;
