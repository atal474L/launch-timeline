import React from "react";
import Phase from "./Phase";

function Timeline(props) {
  return (
    <div className="stepWrapper">
      {props.project.map((item, index) => (
        <Phase
          key={index}
          label={item.phase_name}
          deadline={item.deadline}
          activePhase={item.active}
        ></Phase>
      ))}
    </div>
  );
}

export default Timeline;
// {props.phaseLables.map((item, index) => (
//   <Phase
//     key={index}
//     label={item}
//     deadline={props.phaseDeadlines[index]}
//     activePhase={props.currentPhase === index + 1}
//   ></Phase>
// ))}
