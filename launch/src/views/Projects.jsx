import { Button, Container, Stack } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import "primeicons/primeicons.css";
import ProgressBar from "react-bootstrap/ProgressBar";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";

export default function Projects() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [projects, setProjects] = useState([]);
  const [phaseNameOptions, setPhaseNameOptions] = useState([
    "CMS training",
    "Pre Pre launch",
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
  };

  useEffect(() => {
    fetch(baseUrl + "api/projects-overview")
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
            <Link to={`toevoegen`} className="btn btn-primary secondryBtnLink">
              Nieuw project aanmaken
            </Link>
          </div>
        </Stack>
      </Container>

      <div className="container homeSec2">
        {/* <Container className="homeTable">
          
        </Container> */}
        <Stack direction="horizontal" className="project-filters">
          <Dropdown
            value={selectedPhaseName}
            options={phaseNameOptions}
            onChange={onPhaseNameFilterChange}
            placeholder="Filter fase op:"
            className="p-column-filter"
            showClear
          />

          <div className="ms-auto deadline">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                onInput={setGlobalFilters}
                placeholder="Zoeken..."
                className="ms-auto deadline srch"
              ></InputText>
            </span>
          </div>
        </Stack>

        <div className="projectTable">
          <DataTable
            value={projects}
            paginator
            rows={3}
            rowsPerPageOptions={[5, 10, 25, 50]}
            id="custom-table"
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
              showFilterMenu={false}
              filter
            />
            <Column
              field="active_phase_deadline"
              header="Fasedeadline"
              sortable
            ></Column>
            {/* <Column field="progress" header="Progressie" ></Column> */}
            <Column
              header="Progressie"
              body={(rowData) => (
                <ProgressBar
                  now={rowData.progress}
                  label={`${rowData.progress}%`}
                  className="custom-progress-bar"
                />
              )}
            />
            <Column field="state" header="Project status" sortable></Column>
            <Column
              body={(rowData) => (
                <Link to={`${rowData?.id}`} className="primaryLink">
                  Project bekijken
                </Link>
              )}
            />
          </DataTable>
        </div>
      </div>
    </>
  );
}
