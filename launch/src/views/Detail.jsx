import { Button, Container, Stack, Alert } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Timeline from "../components/Timeline";
import Countdown from "../components/Countdown";
import ChecklistTable from "../components/ChecklistTable";
import { Link, useParams } from "react-router-dom";
import DetailsPerPhase from "../components/DetailsPerPhase";

function Detail() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  //deadline countdown
  const [deadlineDate, setDeadlineDate] = useState("");
  const { id } = useParams();
  //timeline
  const [projectTimeline, setProjectTimeline] = useState([]);
  const [activePhaseId, setActivePhaseId] = useState("");
  //details
  const [details, setDetails] = useState([]);
  //phases with checklists
  const [phases, setPhases] = useState([]);

  useEffect(() => {
    //project timeline
    fetch(baseUrl + `api/projects/${id}/timeline`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setProjectTimeline(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    //project details
    fetch(baseUrl + `api/projects/${id}/details`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch the project details");
        }
        return response.json();
      })
      .then((data) => {
        setDetails(data);
        //console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    //project phases with checklist
    fetch(baseUrl + `api/projects/${id}/phases`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch the project phases");
        }
        return response.json();
      })
      .then((data) => {
        setPhases(data);
        //console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    const activePhase = projectTimeline.find((phase) => phase.active === 1);
    setActivePhaseId(activePhase ? activePhase.phase_id : "");
    setDeadlineDate(activePhase ? activePhase.deadline : "");
    //console.log(deadlineDate);
  }, [projectTimeline]);

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
        <h3>{projectTimeline ? projectTimeline[0]?.name : null}</h3>
        <div className="timeline">
          {projectTimeline && <Timeline project={projectTimeline}></Timeline>}
          <div className="d-flex justify-content-end timelineBtn">
            <Link
              to={`/api/project/${
                projectTimeline ? projectTimeline[0]?.project_id : null
              }/${activePhaseId}`}
              className="btn btn-primary primaryBtnLink"
            >
              Start met checklist
            </Link>
          </div>
        </div>
      </div>

      <Container className="details">
        <div className="details-titles">
          <span>
            Project naam:{" "}
            <span>
              {projectTimeline &&
                projectTimeline.length > 0 &&
                projectTimeline[0].name}
            </span>
          </span>
          <span>
            Team:{" "}
            <span>
              {projectTimeline &&
                projectTimeline.length > 0 &&
                projectTimeline[0]["user_name"]}
            </span>
          </span>
          <span>
            Project deadline:{" "}
            <span>
              {projectTimeline &&
                projectTimeline.length > 0 &&
                projectTimeline[0]["project_deadline"]}
            </span>
          </span>
        </div>
        <DetailsPerPhase details={details}></DetailsPerPhase>
      </Container>

      <div className="container homeSec2">
        <h2>Checklists invullen</h2>
        <div className="homeTable">
          <ChecklistTable phases={phases}></ChecklistTable>
        </div>
      </div>
    </>
  );
}

export default Detail;
