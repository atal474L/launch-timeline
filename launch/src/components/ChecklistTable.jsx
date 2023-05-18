import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import ProgressBar from "react-bootstrap/ProgressBar";

export default function ProjectTable(props) {
  //const [data, setData] = useState(props.phases);

  return (
    <Table>
      <thead>
        <tr>
          <th>Checklist naam</th>
          <th>Progressie</th>
          <th>Checks to do</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {Object.values(props.phases).map((phase, index) =>
          phase && index !== undefined ? (
            <tr key={`phase_${index}`}>
              <td>{phase["0"].phase.phase_name}</td>
              <td>
                <ProgressBar
                  now={phase?.progress}
                  label={`${phase?.progress}%`}
                  variant="success"
                />
              </td>
              <td>Nog {phase?.total_checks - phase?.checked} check(s)</td>
              <td>
                <Link
                  to={`api/phases/${phase["0"].phase.id}/details`}
                  className="primaryLink"
                >
                  Ga naar checklist
                </Link>
              </td>
            </tr>
          ) : null
        )}
      </tbody>
    </Table>
  );
}
