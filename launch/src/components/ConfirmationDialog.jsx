import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmationDialog = ({ showConfirmation, handleConfirmationChoice }) => {
  return (
    <Modal
      show={showConfirmation}
      onHide={() => handleConfirmationChoice("no")}
    >
      <Modal.Header closeButton>
        <Modal.Title>Bevestiging</Modal.Title>
      </Modal.Header>
      <Modal.Body>Wil je zeker dit project verwijderen?</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => handleConfirmationChoice("no")}
        >
          Nee
        </Button>
        <Button
          className="primaryBtn"
          variant="success"
          onClick={() => handleConfirmationChoice("yes")}
        >
          Ja
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationDialog;
