import React, { useRef, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { userStateContext } from "../contexts/ContextProvider";
import { Navigate } from "react-router-dom";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, SetError] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser, userToken } = userStateContext();

  if (userToken) {
    return <Navigate to={"/"}></Navigate>;
  }

  return (
    <div className="form-1">
      <Card>
        <Card.Body>
          <h2>Log In</h2>
          {/* {error && (
            <div
              className="card-header alert alert-danger text-center"
              style={{ fontSize: "1.2em" }}
              role="alert"
            >
              {error}
            </div>
          )} */}
          <Form>
            <Form.Group id="email" className="form-group">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} />
            </Form.Group>

            <Form.Group id="password" className="form-group">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} />
            </Form.Group>

            <Button
              disabled={loading}
              className="form-control-submit-button"
              type="submit"
            >
              Log In
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
