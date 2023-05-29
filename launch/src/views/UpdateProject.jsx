import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BASE_URL;

function UpdateProject() {
  const { id } = useParams();
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    projectName: "",
    team: "",
    projectDeadline: "",
    phase1Deadline: "",
    phase2Deadline: "",
    phase3Deadline: "",
    phase4Deadline: "",
    phase5Deadline: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
    getTeams();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(baseUrl + `api/projects/${id}/timeline`);
      const projectData = await response.json();
      setForm({
        projectName: projectData[0].name,
        team: projectData[0].user_id,
        projectDeadline: formatDate(projectData[0].project_deadline),
        phase1Deadline: formatDate(projectData[0].deadline),
        phase2Deadline: formatDate(projectData[1].deadline),
        phase3Deadline: formatDate(projectData[2].deadline),
        phase4Deadline: formatDate(projectData[3].deadline),
        phase5Deadline: formatDate(projectData[4].deadline),
      });
    } catch (error) {
      console.log("Failed to fetch the project:", error);
    }
  };

  const getTeams = async () => {
    try {
      const response = await fetch(baseUrl + "api/teams");
      const data = await response.json();
      setTeams(Object.entries(data));
    } catch (error) {
      console.log("Failed to fetch the teams:", error);
    }
  };

  const setField = (field, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: null,
      }));
    }
  };
  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const validateForm = () => {
    const currentDate = new Date();
    const {
      projectName,
      team,
      projectDeadline,
      phase1Deadline,
      phase2Deadline,
      phase3Deadline,
      phase4Deadline,
      phase5Deadline,
    } = form;
    const newErrors = {};

    if (!projectName.trim()) {
      newErrors.projectName = "Vul a.u.b. de projectnaam in";
    }
    if (team === "") {
      newErrors.team = "Selecteer een team a.u.b.";
    }
    if (!projectDeadline) {
      newErrors.projectDeadline = "Selecteer een geldige deadline a.u.b.";
    }
    if (!phase1Deadline) {
      newErrors.phase1Deadline = "Selecteer een geldige deadline a.u.b.";
    }
    if (!phase2Deadline) {
      newErrors.phase2Deadline = "Selecteer een geldige deadline a.u.b.";
    }
    if (!phase3Deadline) {
      newErrors.phase3Deadline = "Selecteer een geldige deadline a.u.b.";
    }
    if (!phase4Deadline) {
      newErrors.phase4Deadline = "Selecteer een geldige deadline a.u.b.";
    }
    if (!phase5Deadline) {
      newErrors.phase5Deadline = "Selecteer een geldige deadline a.u.b.";
    }

    return newErrors;
  };

  const formatData = (form) => {
    const formattedData = {
      name: form.projectName,
      deadline: form.projectDeadline,
      user_id: form.team,
      phases: [
        { phase_id: 1, deadline: form.phase1Deadline },
        { phase_id: 2, deadline: form.phase2Deadline },
        { phase_id: 3, deadline: form.phase3Deadline },
        { phase_id: 4, deadline: form.phase4Deadline },
        { phase_id: 5, deadline: form.phase5Deadline },
      ],
    };

    return formattedData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setLoading(true);

      fetch(baseUrl + `api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatData(form)),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update the project");
          }
          console.log("Project updated");
          setLoading(false);
          navigate(`/projecten/${id}`);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });
    }
  };

  function handleGoBack() {
    navigate(-1);
  }

  return (
    <Container>
      <div className="create-page">
        <h1>Nieuwe project aanmaken</h1>
      </div>
      <Form onSubmit={handleSubmit} className="form-container">
        <Form.Group controlId="projectName">
          <Form.Label>Projectnaam</Form.Label>
          <Form.Control
            type="text"
            placeholder="Projectnaam"
            value={form.projectName}
            isInvalid={!!errors.projectName}
            onChange={(e) => setField("projectName", e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {errors.projectName}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="team">
          <Form.Label>Selecteer een team</Form.Label>
          <Form.Select
            value={form.team}
            isInvalid={!!errors.team}
            onChange={(e) => setField("team", e.target.value)}
          >
            <option value="">Selecteer</option>
            {teams.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.team}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="projectDeadline">
          <Form.Label>Project deadline</Form.Label>
          <Form.Control
            type="date"
            value={form.projectDeadline}
            isInvalid={!!errors.projectDeadline}
            onChange={(e) => setField("projectDeadline", e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {errors.projectDeadline}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="phase1Deadline">
          <Form.Label>Post CMS Training deadline</Form.Label>
          <Form.Control
            type="date"
            value={form.phase1Deadline}
            isInvalid={!!errors.phase1Deadline}
            onChange={(e) => setField("phase1Deadline", e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {errors.phase1Deadline}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="phase2Deadline">
          <Form.Label>Pre Pre-launch deadline</Form.Label>
          <Form.Control
            type="date"
            value={form.phase2Deadline}
            isInvalid={!!errors.phase2Deadline}
            onChange={(e) => setField("phase2Deadline", e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {errors.phase2Deadline}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="phase3Deadline">
          <Form.Label>Pre-launch deadline</Form.Label>
          <Form.Control
            type="date"
            value={form.phase3Deadline}
            isInvalid={!!errors.phase3Deadline}
            onChange={(e) => setField("phase3Deadline", e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {errors.phase3Deadline}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="phase4Deadline">
          <Form.Label>Post launch deadline</Form.Label>
          <Form.Control
            type="date"
            value={form.phase4Deadline}
            isInvalid={!!errors.phase4Deadline}
            onChange={(e) => setField("phase4Deadline", e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {errors.phase4Deadline}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="phase5Deadline">
          <Form.Label>Offboarding deadline</Form.Label>
          <Form.Control
            type="date"
            value={form.phase5Deadline}
            isInvalid={!!errors.phase5Deadline}
            onChange={(e) => setField("phase5Deadline", e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {errors.phase5Deadline}
          </Form.Control.Feedback>
        </Form.Group>

        {!isLoading && (
          <>
            <div className="form-btns">
              <Button
                variant="secondary"
                onClick={handleGoBack}
                className="secondryBtn"
              >
                Terug gaan
              </Button>
              <Button variant="success" type="submit" className="primaryBtn">
                Updates opslaan
              </Button>
            </div>
          </>
        )}
        {isLoading && (
          <>
            <div className="form-btns">
              <Button
                variant="secondary"
                onClick={handleGoBack}
                className="secondryBtn"
                disabled
              >
                Terug gaan
              </Button>
              <Button
                variant="success"
                type="submit"
                className="primaryBtn"
                disabled
              >
                Updates opslaan
              </Button>
            </div>
          </>
        )}
      </Form>
    </Container>
  );
}

export default UpdateProject;
