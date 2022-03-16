import React, { useEffect, useState } from 'react';
import { Col, Row, Modal } from 'react-bootstrap';
import { Table } from 'antd';
import productService from 'services/product.service';

const RecipeLookUp = ({ recipeId, showRecipe, setShowRecipe }) => {
  const [recipeData, setRecipeData] = useState({});
  const handleClose = () => {
    setShowRecipe(false);
  };
  useEffect(() => {
    if (recipeId) {
      productService
        .getRecipeById(recipeId)
        .then(res => setRecipeData(res.data))
        .catch(error => {
          console.log(error);
        });
    }

    return () => {
      setRecipeData([]);
    };
  }, [recipeId]);
  const header = [
    {
      title: 'ชื่อส่วนผสม',
      dataIndex: 'ingrId',
      key: 'ingrId',
      align: 'center',
      render: (text, record) => <div>{record.ingredient.ingrName}</div>,
    },
    {
      title: 'ปริมาณ',
      key: 'amountRequired',
      dataIndex: 'amountRequired',
      align: 'center',
      render: (text, record) => (
        <div>
          {record.amountRequired} {record.ingredient.ingrUnit}
        </div>
      ),
    },
  ];

  return (
    <Modal
      show={showRecipe}
      onHide={handleClose}
      centered
      style={{ fontFamily: 'Prompt' }}>
      <Modal.Header closeButton>
        <Modal.Title>รายการวัตถุดิบ</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {recipeData.description && (
          <Row>
            <div>คำอธิบายการผสม:{recipeData.description}</div>
          </Row>
        )}

        <Table
          dataSource={
            recipeData.recipe_ingredients ? recipeData.recipe_ingredients : null
          }
          columns={header}
          pagination={false}
          rowkey="ingrId"
        />
      </Modal.Body>
    </Modal>
  );
};

export default RecipeLookUp;
