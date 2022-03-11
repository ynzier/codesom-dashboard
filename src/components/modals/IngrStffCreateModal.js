import React from 'react';
import { Col, Row, Card, Modal, Button } from 'react-bootstrap';
import { IngrStffCreateForm } from 'components';

const IngrStffCreateModal = ({ showCreate, setShowCreate, fetchData }) => {
  const handleClose = () => setShowCreate(false);
  return (
    <Modal show={showCreate} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>เพิ่มข้อมูลวัตถุดิบ</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <IngrStffCreateForm handleClose={handleClose} fetchData={fetchData} />
      </Modal.Body>
    </Modal>
  );
};

export default IngrStffCreateModal;
