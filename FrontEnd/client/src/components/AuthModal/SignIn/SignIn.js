import React from 'react';
import { Form, Input, Button, Checkbox, Spin, Row, Col, message } from 'antd';
import FormBuilder from 'antd-form-builder';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import { FaFacebookF } from 'react-icons/fa';
import { connect } from 'react-redux';

function SignIn(props) {
  const formLogin = FormBuilder.createForm();

  const onFinish = (values) => {
    props.onSignIn(values);
    formLogin.resetFields();
  };

  const responseFacebook = (response) => {
    if (!!response.status) {
      message.warning('LOGIN FACEBOOK FAILED');
    } else {
      const body = {
        name: response.name,
        email: response.email,
        avatar: !!response.picture ? response.picture.data.url : null,
        userId: response.id,
      };
      props.loginFb(body);
    }
  };

  const handleSignInNow = (value) => {
    props.onSignInNowClick(value);
  };

  return (
    <Spin spinning={props.isLoading} tip="ĐĂNG NHẬP" size="large">
      <Form
        form={formLogin}
        name="normal_login"
        className="login-form"
        initialValues={{
          username: '',
          password: '',
          remember: false,
        }}
        onFinish={onFinish}
        onFieldsChange={this.handleChangeLogin}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Xin vui lòng nhập tài khoản!',
            },
            {
              whitespace: true,
              message: 'Tài khoản toàn là dấu cách!',
            },
          ]}
          hasFeedback
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Xin vui lòng nhập mật khẩu!',
            },
            {
              min: 10,
              message: 'Mật khẩu phải có 10 ký tự trở lên!',
            },
            {
              whitespace: true,
              message: 'Mật khẩu toàn là dấu cách!',
            },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Nhớ tài khoản? </Checkbox>
          </Form.Item>

          <Link onClick={() => handleSignInNow('3')} className="login-form-forgot" to="#">
            Quên mật khẩu
          </Link>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            style={{
              height: '45px',
              border: '1px solid #fadb14',
              backgroundColor: '#fadb14',
              textTransform: 'uppercase',
              fontSize: 16,
              fontWeight: 'bold',
            }}
            htmlType="submit"
            className="login-form-button"
          >
            ĐĂNG NHẬP
          </Button>
        </Form.Item>
        <Row>
          <Col span={24}>
            <div>
              <FacebookLogin
                appId={646768039528160}
                autoLoad={true}
                fields="name,email,picture"
                callback={responseFacebook}
                cssClass="my-facebook-button-class"
                icon={<FaFacebookF style={{ marginRight: 5 }} />}
              />
            </div>
          </Col>
        </Row>
        <br />
      </Form>
    </Spin>
  );
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.auth.isLoadingLogin,
  };
};

export default connect(mapStateToProps, null)(SignIn);
