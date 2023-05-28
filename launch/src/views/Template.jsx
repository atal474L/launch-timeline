import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import NavigationButtons from "../components/NavigationButtons";
import ChecklistPerPhase from "../components/ChecklistPerPhase";
import { useNavigate, useParams } from "react-router-dom";

function Template() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [data, setData] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(baseUrl + `api/projects/${id}/checklist/template`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch the template");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        const allItemIds = data.flatMap((phase) =>
          phase.items.map((item) => item.id)
        );
        setSelectedItems(allItemIds);
      })

      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  function checkboxHandler(e) {
    const isSelected = e.target.checked;
    const value = parseInt(e.target.value);

    if (isSelected) {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, value]);
    } else {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((id) => id !== value)
      );
    }
  }

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  function saveSelectedItems(e) {
    e.preventDefault();

    if (selectedItems.length === 0) {
      console.log("Geen item geselecteerd");
      return;
    }

    const selectedItemsData = data.flatMap((phase) =>
      phase.items.filter((item) => selectedItems.includes(item.id))
    );

    const formattedData = selectedItemsData.map((item) => ({
      id: item.id,
      checklist_template_id: item.checklist_template_id,
      phase_id: item.phase_id,
      question_checked: 0,
      comment: "dd",
    }));

    fetch(baseUrl + `api/projects/${id}/checklist/template`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: formattedData }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save the template");
        }
      })
      .then(() => {
        navigate(`/projecten/${id}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <>
      <div className="container">
        <div className="template-page">
          <h1>Template configureren</h1>
          <p>
            Hier kan de checklist template geconfigureerd worden voor de huidige
            project.<br></br> Vink de checks aan die op dit project van
            toepassing zijn.
          </p>
        </div>
        <form onSubmit={saveSelectedItems}>
          <div className="form-container">
            <div className="left">
              {data
                .filter((item) => item.phase_id === currentStep)
                .map((phase) => (
                  <ChecklistPerPhase
                    key={phase.phase_id}
                    phase={phase}
                    selectedItems={selectedItems}
                    checkboxHandler={checkboxHandler}
                  />
                ))}
            </div>
          </div>
          <div className="navigation-buttons">
            <NavigationButtons
              currentStep={currentStep}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
            />
            {currentStep === 5 ? (
              <Button type="submit" variant="success" className="primaryBtn">
                Opslaan
              </Button>
            ) : (
              <></>
            )}
          </div>
        </form>
        <h3>Result will print here: {selectedItems.toString()} </h3>
      </div>
    </>
  );
}

export default Template;
