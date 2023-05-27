import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const OneCheckbox = ({ item, selectedItems, checkboxHandler }) => {
  return (
    <div className="card">
      <label>
        <input
          type="checkbox"
          checked={selectedItems.includes(item.id)}
          value={item.id}
          onChange={checkboxHandler}
        />
      </label>
      <h1>Id: {item.id}</h1>
      <h2>{item.checklist_template_id}</h2>
      <p>{item.question}</p>
    </div>
  );
};

function Checklist() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          baseUrl + "api/projects/23/phases/1/checklist"
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
    console.log(updatedData);

    fetch(baseUrl + "api/projects/23/phases/1/checklist", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save the checklist");
        }
        console.log("Checklist saved successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <>
      <div className="container">
        <form>
          {data.map((item, index) => (
            <OneCheckbox
              key={index}
              item={item}
              selectedItems={selectedItems}
              checkboxHandler={checkboxHandler}
            />
          ))}

          <div className="right">
            <div className="results">
              <h3>Result will print here: {selectedItems.toString()} </h3>
              <Button type="button" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Checklist;
