import React, { useState } from 'react';
import { Modal, Tabs, message } from 'antd';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import ForgetPassword from './ForgetPassword/ForgetPassword';
import axiosInstance from '../../utils/axiosInstance';
import { connect } from 'react-redux';
import { fetch_register, fetch_login, login_fb_error, login_fb_success } from '../../action/authAction';

const { TabPane } = Tabs;

function ModalUI(props) {
  const [active, setActive] = useState("1");

  const handleRegisterSuccess = (value) => {
    if (value) {
      setActive("1");
    } else {
      setActive("2");
    }
  }

  const handleSignUp = (values) => {
    props.register(values);
  }

  const handleSignIn = (values) => {
    props.login(values);
  }

  const handleForgotPassword = async (email) => {
    await axiosInstance('User/ForgetPassword', 'POST', { email: email })
      .then(res => {
        if (res.data === true) {
          message.success('Vui lòng vào Mail để Reset Password!', 4);
          props.onCancelAuthModal();
        } else {
          message.warning('Thất bại!', 4);
          props.onCancelAuthModal();
        }
      })
  }

  const handleLoginFb = async (values) => {
    await axiosInstance("User/LoginWithFacebook", "POST", values)
      .then(res => {
        if (!!res.data) {
          props.login_fb_success(res.data);
        }
      })
      .catch(err => {
        console.log({ ...err });
        message.warning(`${err.response.data}`, 4);
        props.login_fb_error();
      })
  }

  return (
    <div>
      <Modal
        visible={props.visible}
        footer={false}
        onOk={props.onOKAuthModal}
        onCancel={props.onCancelAuthModal}
      >
        <Tabs activeKey={active} onChange={setActive}>
          <TabPane tab="ĐĂNG NHẬP" key="1">
            {active === "1" ? (
              <SignIn
                onSignIn={handleSignIn}
                onSignInNowClick={setActive}
                loginFb={handleLoginFb}
              />
            ) : null}
          </TabPane>
          <TabPane tab="ĐĂNG KÝ" key="2">
            {active === "2" ? (
              <SignUp onSignUp={handleSignUp} />
            ) : null}
          </TabPane>
          <TabPane tab="" key="3">
            {active === "3" ? (
              <ForgetPassword onForgot={handleForgotPassword} />
            ) : null}
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    registerSuccess: state.auth.registerSuccess,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (data) => {
      dispatch(fetch_register(data));
    },
    login: (data) => {
      dispatch(fetch_login(data));
    },
    login_fb_success: (data) => {
      dispatch(login_fb_success(data));
    },
    login_fb_error: () => {
      dispatch(login_fb_error());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUI);
