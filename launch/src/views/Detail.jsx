import { Button, Container, Stack } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Timeline from "../components/Timeline";
import Countdown from "../components/Countdown";
import { Link, useParams } from "react-router-dom";

function Detail() {
  const rooturl = process.env.rooturl;

  const [deadlineDate, setDeadlineDate] = useState("");
  const { id } = useParams();

  const [todaysProject, setTodaysProject] = useState([]);
  const [activePhaseId, setActivePhaseId] = useState("");

  useEffect(() => {
    fetch(rooturl + "/api/homeproject")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setTodaysProject(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    console.log(id);
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
          <h1>Project details</h1>

          <div className="ms-auto deadline">
            <span>Volgende deadline binnen: </span>
            <Countdown date={deadlineDate}></Countdown>
          </div>
        </Stack>
      </Container>
      <div className="container timelineBg">
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

export default Detail;
