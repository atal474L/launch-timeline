import { Container, Stack } from "react-bootstrap";
import React, { useState } from "react";
import Timeline from "../components/Timeline";

function Home() {
  const phaseLables = ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"];
  const phaseDeadlines = [
    "05-02-2023",
    "10-02-2023",
    "05-09-2023",
    "05-08-2023",
    "05-12-2023",
  ];
  const [currentPhase, updateCurrentPhase] = useState(3);

  return (
    <>
      <Container>
        <Stack direction="horizontal">
          <h1>Launch timeline</h1>
          <div className="ms-auto">vla vla</div>
        </Stack>
      </Container>

      <div className="timeline">
        <Timeline
          phaseDeadlines={phaseDeadlines}
          phaseLables={phaseLables}
          currentPhase={currentPhase}
        ></Timeline>
        <p>Selected Step: {currentPhase}</p>
      </div>
    </>
  );
}

export default Home;
