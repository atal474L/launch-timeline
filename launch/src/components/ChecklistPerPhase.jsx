import OneCheckbox from "../components/OneCheckbox";

const ChecklistPerPhase = ({ phase, selectedItems, checkboxHandler }) => {
  return (
    <div key={phase.phase_id}>
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
