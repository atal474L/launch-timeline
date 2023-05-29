import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import OneCheckbox from "../components/OneCheckbox";
import ProgressBar from "react-bootstrap/ProgressBar";

function Checklist() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { projectId, checklistId } = useParams();
  const progress = Math.round((selectedItems.length / data.length) * 100);
  const navigate = useNavigate();
  const title = [
    "CMS training",
    "Pre Pre-launch",
    "Pre-launch",
    "Post launch",
    "Offboarding",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          baseUrl + `api/projects/${projectId}/phases/${checklistId}/checklist`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch the checklist");
        }
        const responseData = await response.json();
        setData(responseData);

        const checkedItemIds = responseData
          .filter((item) => item.question_checked === 1)
          .map((item) => item.id);
        setSelectedItems(checkedItemIds);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
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

  function handleSave() {
    const updatedData = {
      ids: data.map((item) => item.id),
      question_checked: data.map((item) =>
        selectedItems.includes(item.id) ? 1 : 0
      ),
    };
    setLoading(true);

    fetch(
      baseUrl + `api/projects/${projectId}/phases/${checklistId}/checklist`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save the checklist");
        }
        console.log("Checklist saved successfully");
        setLoading(false);
      })
      .then(() => {
        navigate(`/projecten/${projectId}`);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }

  return (
    <>
      <div className="container">
        <div className="template-page">
          <h1>Checklist {title[checklistId - 1]}</h1>
        </div>
        <form>
          <div className="form-container">
            <ProgressBar
              now={progress}
              label={progress ? `${progress}%` : 0}
              className="custom-progress-bar"
            />
            <h4 className="checks-title">{title[checklistId - 1]}</h4>
            {data.map((item, index) => (
              <OneCheckbox
                key={index}
                item={item}
                selectedItems={selectedItems}
                checkboxHandler={checkboxHandler}
              />
            ))}
          </div>

          <div className="navigation-buttons">
            {!isLoading && (
              <Button
                type="button"
                variant="success"
                className="primaryBtn"
                onClick={handleSave}
              >
                Opslaan
              </Button>
            )}
            {isLoading && (
              <Button
                type="button"
                variant="scondary"
                className="primaryBtn"
                onClick={handleSave}
                disabled
              >
                Aan het opslaan...
              </Button>
            )}
          </div>
        </form>
        {/* <h3>Result will print here: {selectedItems.toString()} </h3> */}
      </div>
    </>
  );
}

export default Checklist;
