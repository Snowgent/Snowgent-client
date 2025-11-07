import { useState } from 'react';
import Navigation from '../../components/Navigation';
import FormButton from '../../components/onboarding/FormButton';
import { useNavigate } from 'react-router-dom';
import TextInput from '../../components/onboarding/TextInput';
import PriceInput from '../../components/onboarding/PriceInput';
import SingleSelect from '../../components/onboarding/SingleSelect';
import MultiSelect from '../../components/onboarding/MultiSelect';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    navigate('/chat');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SingleSelect key="step1" title="업종을" />;
      case 2:
        return <TextInput key="step2" title="업체명을" placeholder="" />;
      case 3:
        return <TextInput key="step3" title="위치(시군구)를" placeholder="" />;
      case 4:
        return <PriceInput key="step4" title="평균 월매출" placeholder="숫자" />;
      case 5:
        return <PriceInput key="step5" title="목표 월매출" placeholder="숫자" />;
      default:
        return <MultiSelect key="default" title="원하는 타겟층" />;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Navigation />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>단계 {currentStep}</span>
            <span>
              {currentStep} / {totalSteps}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-[#0D2D84] transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">{renderStepContent()}</div>

        <div className="mt-6 flex gap-3">
          {currentStep > 1 && <FormButton type="prev" onClick={handlePrev} />}
          {currentStep === totalSteps ? (
            <FormButton type="submit" onClick={handleComplete} />
          ) : (
            <FormButton type="next" onClick={handleNext} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
