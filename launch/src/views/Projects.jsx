import { Button, Container, Stack } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectTable from "../components/ProjectTable";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Search from "../components/Search";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const getPage = function (page, limit) {
    let array = [];
    for (let i = (page - 1) * limit; i < page * limit; i++) {
      array.push(projects[i]);
    }
    return array;
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/projectoverview")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch the projects");
        }
        return response.json();
      })
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <>
      <Container>
        <Stack direction="horizontal" className="home">
          <h1>Projecten overzicht</h1>

          <div className="ms-auto deadline">
            <Link
              // to={`/api/project/${
              //   todaysProject ? todaysProject[0]?.project_id : null
              // }/${activePhaseId}`}
              className="btn btn-primary secondryBtnLink"
            >
              Nieuw project aanmaken
            </Link>
          </div>
        </Stack>
      </Container>

      <div className="container homeSec2">
        <Container className="homeTable">
          {/* {projects && <ProjectTable projects={getPage(1, 3)}></ProjectTable>} */}
        </Container>

        <DataTable
          value={projects}
          paginator
          rows={3}
          rowsPerPageOptions={[5, 10, 25, 50]}
          className="table"
        >
          <Column field="name" header="Projectnaam" sortable></Column>
          <Column
            field={(rowData) => rowData?.phases[0]?.phase_name}
            header="Actieve fase"
          />
          <Column
            field="active_phase_deadline"
            header="Fasedeadline"
            sortable
          ></Column>
          <Column field="progress" header="Progressie"></Column>
          <Column field="state" header="Project status" sortable></Column>
          <Column
            body={(rowData) => (
              <Link
                to={`api/projects/${rowData?.id}/details`}
                className="primaryLink"
              >
                Project bekijken
              </Link>
            )}
          />
        </DataTable>
      </div>
    </>
  );
}
