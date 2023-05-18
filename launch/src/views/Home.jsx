import { Button, Container, Stack } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Timeline from "../components/Timeline";
import Countdown from "../components/Countdown";
import { Link } from "react-router-dom";
import ProjectTable from "../components/ProjectTable";

function Home() {
  const [deadlineDate, setDeadlineDate] = useState("");

  const [todaysProject, setTodaysProject] = useState([]);
  const [activePhaseId, setActivePhaseId] = useState("");

  const [topTenProjects, setTopTenProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/homeproject")
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

    // top 10 projecten op basis van deadline
    fetch("http://localhost:8000/api/toptenprojects")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch top ten projects");
        }
        return response.json();
      })
      .then((data) => {
        setTopTenProjects(data);
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

      <div className="container homeSec2">
        <h2>Top 10 projecten gebaseerd op eerstvolgende deadlines</h2>
        <div className="homeTable">
          {topTenProjects && (
            <ProjectTable projects={topTenProjects}></ProjectTable>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
