import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import NavigationButtons from "../components/NavigationButtons";
import ChecklistPerPhase from "../components/ChecklistPerPhase";

function Template() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [data, setData] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetch(baseUrl + "api/projects/22/checklist/template")
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

    fetch(baseUrl + "api/projects/22/checklist/template/", {
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
      .catch((error) => {
        console.error("Error:", error);
      });
    console.log(formattedData);
  }

  return (
    <>
      <div className="container">
        <form onSubmit={saveSelectedItems}>
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

          <NavigationButtons
            currentStep={currentStep}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
          />

          <div className="right">
            <div className="results">
              <h3>Result will print here: {selectedItems.toString()} </h3>
              <Button type="submit">Save</Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Template;
