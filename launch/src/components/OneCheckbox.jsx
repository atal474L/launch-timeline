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

export default OneCheckbox;
