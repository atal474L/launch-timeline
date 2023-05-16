import { Button, Container, Stack } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Dropdown } from "primereact/dropdown";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [phaseNameOptions, setPhaseNameOptions] = useState([
    "Post CMS training",
    "Pre Pre-launch",
    "Pre-launch",
    "Post launch",
    "Offboarding",
  ]);
  const [selectedPhaseName, setSelectedPhaseName] = useState();
  const [filters, setFilters] = useState();

  const onPhaseNameFilterChange = (e) => {
    setSelectedPhaseName(e.value);
    setFilters({
      global: {
        value: e.value,
        matchMode: FilterMatchMode.EQUALS,
      },
    });
  };

  const setGlobalFilters = (e) => {
    setFilters({
      global: {
        value: e.target.value,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
    debugger;
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
        {/* <Container className="homeTable">
          
        </Container> */}
        <InputText onInput={setGlobalFilters}></InputText>
        <Dropdown
          value={selectedPhaseName}
          options={phaseNameOptions}
          onChange={onPhaseNameFilterChange}
          placeholder="Select Phase Name"
          className="p-column-filter"
          showClear
        />
        <DataTable
          value={projects}
          paginator
          rows={3}
          rowsPerPageOptions={[5, 10, 25, 50]}
          className="table"
          filters={filters}
        >
          <Column field="name" header="Projectnaam" sortable></Column>
          {/* <Column
            field={(rowData) => rowData?.phases[0]?.phase_name}
            header="Actieve fase"
          /> */}

          <Column
            field={(rowData) => rowData?.phases[0]?.phase_name}
            header="Phase Name"
            filter
            filterElement={
              <Dropdown
                value={selectedPhaseName}
                options={phaseNameOptions}
                onChange={onPhaseNameFilterChange}
                placeholder="Select Phase Name"
                className="p-column-filter"
                showClear
              />
            }
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
