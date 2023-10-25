import React from 'react';
import { Row, Col, Form, Input, Button, Spin } from 'antd';
import FormBuilder from 'antd-form-builder';
import { UserOutlined } from '@ant-design/icons';

const ForgetPassword = ({ onForgot }) => {
  const formForget = FormBuilder.createForm();

  const onFinish = (values) => {
    onForgot(values.email);
    formForget.resetFields();
  };

  return (
    <div>
      <Form
        form={formForget}
        className="login-form"
        initialValues={{
          email: '',
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              type: 'email',
              message: 'Nhập email không hợp lệ!',
            },
            {
              required: true,
              message: 'Xin vui lòng nhập email',
            },
          ]}
          hasFeedback
        >
          <Input placeholder="Nhập Email" />
        </Form.Item>
        <Row>
          <Col lg={{ span: 4, offset: 10 }}>
            <Button htmlType="submit" type="primary">
              Xác nhận
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ForgetPassword;
