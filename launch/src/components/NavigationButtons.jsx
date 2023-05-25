import { Button } from "react-bootstrap";
const NavigationButtons = ({ currentStep, handlePrevious, handleNext }) => {
  const maxSteps = 5;

  return (
    <div className="steps">
      {currentStep > 1 && (
        <Button
          onClick={handlePrevious}
          variant="secondary"
          className="secondryBtn"
        >
          Vorige fase
        </Button>
      )}
      {currentStep < maxSteps && (
        <Button onClick={handleNext} variant="success" className="primaryBtn">
          Volgende fase
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;
