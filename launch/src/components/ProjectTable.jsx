import React from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

export default function ProjectTable(props) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Projectnaam</th>
          <th>Actieve fase</th>
          <th>Fasedeadline</th>
          <th>Progressie</th>
          <th>Projectstatus</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.projects.map((project) => (
          <tr key={project.id}>
            <td>{project.name}</td>
            <td>{project.phases[0].phase_name}</td>
            <td>{project.active_phase_deadline}</td>
            <td>{project.progress} %</td>
            <td>{project.state}</td>
            <td>
              <Link
                to={`api/projects/${project.id}/details`}
                className="primaryLink"
              >
                Project bekijken
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
