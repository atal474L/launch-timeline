import { Button, Container, Stack } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Timeline from "../components/Timeline";
import Countdown from "../components/Countdown";
import { Link } from "react-router-dom";

function Home() {
  const [deadlineDate, setDeadlineDate] = useState("");

  const [todaysProject, setTodaysProject] = useState([]);
  const [activePhaseId, setActivePhaseId] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/homeproject")
      .then((respone) => respone.json())
      .then((data) => {
        setTodaysProject(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    const activePhase = todaysProject.find((phase) => phase.active === 1);
    setActivePhaseId(activePhase ? activePhase.phase_id : "");
    setDeadlineDate(activePhase ? activePhase.deadline : "");
    //console.log(deadlineDate);
  }, [todaysProject]);

  return (
    <>
      <Container>
        <Stack direction="horizontal" className="home">
          <h1>Launch timeline</h1>

          <div className="ms-auto deadline">
            <span>Volgende deadline binnen: </span>
            <Countdown date={deadlineDate}></Countdown>
          </div>
        </Stack>
      </Container>
      <div className="container timelineBg">
        {/* <h3>{todaysProject ?? todaysProject[0].name}</h3> */}
        <h3>{todaysProject ? todaysProject[0]?.name : null}</h3>
        <div className="timeline">
          {todaysProject && <Timeline project={todaysProject}></Timeline>}
          <div className="d-flex justify-content-end timelineBtn">
            <Link
              to={`/api/project/${
                todaysProject ? todaysProject[0]?.project_id : null
              }/${activePhaseId}`}
              className="btn btn-primary primaryBtnLink"
            >
              Start met checklist
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
