const OneCheckbox = ({ item, selectedItems, checkboxHandler }) => {
  return (
    <div className="one-checkbox">
      <label>
        <input
          type="checkbox"
          checked={selectedItems.includes(item.id)}
          value={item.id}
          onChange={checkboxHandler}
        />
      </label>
      <p className={selectedItems.includes(item.id) ? "line-through" : ""}>
        {item.question}
      </p>
    </div>
  );
};

export default OneCheckbox;
{
  /* <div className="card">
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
</div>; */
}
