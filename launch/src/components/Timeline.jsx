import React from "react";
import Phase from "./Phase";

function Timeline(props) {
  return (
    <div className="stepWrapper">
      {props.phaseLables.map((item, index) => (
        <Phase
          key={index}
          label={item}
          deadline={props.phaseDeadlines[index]}
          activePhase={props.currentPhase === index + 1}
        ></Phase>
      ))}
    </div>
  );
}

export default Timeline;
