import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Button, message } from 'antd';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const containerStyle = {
  border: '1px solid #f0f0f0',
  padding: 20,
  borderRadius: 5,
  background: '#f0f0f0',
};

const titleStyle = {
  textAlign: 'center',
  padding: 15,
};

const ResetPassword = (props) => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const query = queryString.parse(props.location.search);
    setToken(query.token);
    setEmail(query.email);
    setIsSuccess(false);
  }, [props.location.search]);

  const handleSubmit = async (values) => {
    if (!!token && !!email) {
      const body = {
        token: token.split(' ').join('+'),
        email: email,
        newPassword: values.password,
      };

      try {
        const res = await axiosInstance('User/ResetPassword', 'POST', body);

        if (res.data) {
          message.success('Reset Password thành công!', 3);
          setIsSuccess(true);
        } else {
          message.warning('Reset Password thất bại!', 3);
          setIsSuccess(true);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsSuccess(true);
    }
  };

  if (!isSuccess) {
    return (
      <Row>
        <Col lg={{ span: 8, offset: 8 }} style={{ padding: 10 }}>
          <div style={containerStyle}>
            <h3 style={titleStyle}>QUÊN MẬT KHẨU</h3>
            <hr />
            <br></br>
            <br></br>
            <Form onFinish={handleSubmit} {...formItemLayout}>
              <Form.Item
                name="password"
                label="Mật khẩu mới"
                rules={[
                  {
                    required: true,
                    message: 'Xin vui lòng nhập mật khẩu!',
                  },
                  {
                    min: 10,
                    message: 'Mật khẩu phải có tối thiểu 10 ký tự!',
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirm"
                label="Nhập lại mật khẩu"
                dependencies={['password']}
                rules={[
                  {
                    required: true,
                    message: 'Xin vui lòng nhập lại mật khẩu!',
                  },
                  {
                    min: 8,
                    message: 'Mật khẩu phải có tối thiểu 8 ký tự!',
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject('Nhập lại mật khẩu chưa khớp với mật khẩu ở trên!');
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
              <br></br>
              <div style={{ textAlign: 'center' }}>
                <Button htmlType="submit" type="primary">
                  Xác nhận
                </Button>
              </div>
              <br></br>
            </Form>
          </div>
        </Col>
      </Row>
    );
  } else {
    return <Redirect to="/" />;
  }
};

export default ResetPassword;
