import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import ProgressBar from "react-bootstrap/ProgressBar";

export default function ProjectTable(props) {
  const [data, setData] = useState(props.projects);
  const [order, setOrder] = useState("ASC");

  useEffect(() => {
    setData(props.projects);
    console.log(data);
  }, [props]);

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...data].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setData(sorted);
      setOrder("DESC");
    }

    if (order === "DESC") {
      const sorted = [...data].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setData(sorted);
      setOrder("ASC");
    }
  };

  return (
    <Table>
      <thead>
        <tr>
          <th onClick={() => sorting("name")}>Projectnaam</th>
          <th>Actieve fase</th>
          <th>Fase deadline</th>
          <th>Progressie</th>
          <th>Projectstatus</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((project, index) =>
            project && index !== undefined ? (
              <tr key={`project_${index}`}>
                <td>{project.name}</td>
                <td>{project?.phases[0]?.phase_name}</td>
                <td>{project?.active_phase_deadline}</td>
                <td>
                  <ProgressBar
                    now={project?.progress}
                    label={`${project?.progress}%`}
                    variant="success"
                  />
                </td>
                <td>{project?.state}</td>
                <td>
                  <Link
                    to={`api/projects/${project?.id}/details`}
                    className="primaryLink"
                  >
                    Project bekijken
                  </Link>
                </td>
              </tr>
            ) : null
          )
        ) : (
          <tr>
            <td colSpan={6}>Geen projecten gevonden</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
