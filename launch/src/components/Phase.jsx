function Phase(props) {
  return (
    <div className={"stepBlock" + (props.activePhase ? " activated" : "")}>
      <p>{props.deadline}</p>
      <div className="circleWrapper">
        <div className="circle"></div>
      </div>
      <span>{props.label}</span>
    </div>
  );
}

export default Phase;
