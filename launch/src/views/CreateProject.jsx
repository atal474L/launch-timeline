import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BASE_URL;

const generateDefaultPhaseDeadline = (projectDeadline, fieldName) => {
  const date = new Date(projectDeadline);
  const deadlineDate = new Date(date);

  if (fieldName === "phase1Deadline") {
    deadlineDate.setDate(deadlineDate.getDate() - 28);
  } else if (fieldName === "phase2Deadline") {
    deadlineDate.setDate(deadlineDate.getDate() - 21);
  } else if (fieldName === "phase3Deadline") {
    deadlineDate.setDate(deadlineDate.getDate() - 14);
  } else if (fieldName === "phase4Deadline") {
    deadlineDate.setDate(deadlineDate.getDate() + 7);
  } else if (fieldName === "phase5Deadline") {
    deadlineDate.setDate(deadlineDate.getDate() + 14);
  }

  return deadlineDate.toISOString().split("T")[0];
};

function CreateProject() {
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
    getTeams();
  }, []);

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
    if (!projectDeadline || new Date(projectDeadline) < currentDate) {
      newErrors.projectDeadline = "Selecteer een geldige deadline a.u.b.";
    }
    if (!phase1Deadline || new Date(phase1Deadline) < currentDate) {
      newErrors.phase1Deadline = "De deadline mag niet in het verleden liggen";
    }
    if (!phase2Deadline || new Date(phase2Deadline) < currentDate) {
      newErrors.phase2Deadline = "De deadline mag niet in het verleden liggen";
    }
    if (!phase3Deadline || new Date(phase3Deadline) < currentDate) {
      newErrors.phase3Deadline = "De deadline mag niet in het verleden liggen";
    }
    if (!phase4Deadline || new Date(phase4Deadline) < currentDate) {
      newErrors.phase4Deadline = "De deadline mag niet in het verleden liggen";
    }
    if (!phase5Deadline || new Date(phase5Deadline) < currentDate) {
      newErrors.phase5Deadline = "De deadline mag niet in het verleden liggen";
    }

    return newErrors;
  };

  const formatData = (form) => {
    const formattedData = {
      name: form.projectName,
      deadline: form.projectDeadline,
      user_id: form.team,
      phases: [
        { phase_id: 1, deadline: form.phase1Deadline, active: 1 },
        { phase_id: 2, deadline: form.phase2Deadline, active: 0 },
        { phase_id: 3, deadline: form.phase3Deadline, active: 0 },
        { phase_id: 4, deadline: form.phase4Deadline, active: 0 },
        { phase_id: 5, deadline: form.phase5Deadline, active: 0 },
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

      fetch(baseUrl + "api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formatData(form)),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to create the project");
          }
          console.log("Project created");
          setLoading(false);
          return response.json();
        })
        .then((data) => {
          const projectId = data.project_id;
          if (e.target.innerText === "Opslaan en doorgaan") {
            navigate(`/projecten/toevoegen/${projectId}/template`);
          } else {
            navigate("/projecten");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (form.projectDeadline) {
      setForm((prevForm) => ({
        ...prevForm,
        phase1Deadline: generateDefaultPhaseDeadline(
          prevForm.projectDeadline,
          "phase1Deadline"
        ),
        phase2Deadline: generateDefaultPhaseDeadline(
          prevForm.projectDeadline,
          "phase2Deadline"
        ),
        phase3Deadline: generateDefaultPhaseDeadline(
          prevForm.projectDeadline,
          "phase3Deadline"
        ),
        phase4Deadline: generateDefaultPhaseDeadline(
          prevForm.projectDeadline,
          "phase4Deadline"
        ),
        phase5Deadline: generateDefaultPhaseDeadline(
          prevForm.projectDeadline,
          "phase5Deadline"
        ),
      }));
    }
  }, [form.projectDeadline]);

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
              <Button
                variant="success"
                value="Opslaan en doorgaan"
                onClick={handleSubmit}
                className="primaryBtn"
              >
                Opslaan en doorgaan
              </Button>
            </div>
            <div>
              <Button type="submit" variant="success" className="thirdBtn">
                Project opslaan
              </Button>
            </div>
          </>
        )}
        {isLoading && (
          <Button type="submit" disabled className="primaryBtn">
            Aan het opslaan...
          </Button>
        )}
      </Form>
    </Container>
  );
}

export default CreateProject;
