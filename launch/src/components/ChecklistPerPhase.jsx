import { useState } from "react";
import OneCheckbox from "../components/OneCheckbox";

const ChecklistPerPhase = ({ phase, selectedItems, checkboxHandler }) => {
  const [phaseNameOptions, setPhaseNameOptions] = useState([
    "CMS training",
    "Pre Pre launch",
    "Pre-launch",
    "Post launch",
    "Offboarding",
  ]);
  return (
    <div key={phase.phase_id}>
      <h4 className="checks-title">{phaseNameOptions[phase.phase_id - 1]}</h4>
      {phase.items.map((item, index) => (
        <OneCheckbox
          key={index}
          item={item}
          selectedItems={selectedItems}
          checkboxHandler={checkboxHandler}
        />
      ))}
    </div>
  );
};

export default ChecklistPerPhase;
