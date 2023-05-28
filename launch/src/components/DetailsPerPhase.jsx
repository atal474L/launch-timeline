import React, { useState } from "react";
import { Button } from "react-bootstrap";

export default function DetailsPerPhase(props) {
  const [currentStep, setCurrentStep] = useState(1);
  const checkedQuestions = [];
  const uncheckedQuestions = [];
  const title = [
    "CMS training",
    "Pre Pre-launch",
    "Pre-launch",
    "Post launch",
    "Offboarding",
  ];

  props.details.forEach((phase) => {
    if (phase.phase_id === currentStep) {
      phase.items.forEach((item) => {
        if (item.question_checked === 1) {
          checkedQuestions.push(item);
        } else {
          uncheckedQuestions.push(item);
        }
      });
    }
  });

  const checkedQuestionsElements = checkedQuestions.map((question) => (
    <p key={question.id} className="questions">
      {question.question}
    </p>
  ));

  const uncheckedQuestionsElements = uncheckedQuestions.map((question) => (
    <p key={question.id} className="questions">
      {question.question}
    </p>
  ));

  const renderStepContent = () => {
    return (
      <>
        <h3 className="detailsPhaseName">{title[currentStep - 1]}</h3>
        <div className="details-elements">
          <div>
            <h3>Klaar</h3>
            {checkedQuestionsElements}
          </div>
          <div>
            <h3>Niet klaar</h3>
            {uncheckedQuestionsElements}
          </div>
        </div>
      </>
    );
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderNavigationButtons = () => {
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
        {currentStep < 5 && (
          <Button onClick={handleNext} variant="success" className="primaryBtn">
            Volgende fase
          </Button>
        )}
      </div>
    );
  };
  return (
    <div>
      {renderStepContent()}
      {renderNavigationButtons()}
    </div>
  );
}
