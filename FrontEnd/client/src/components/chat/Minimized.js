import React from 'react';
import { IconButton, ChatIcon } from '@livechat/ui-kit';
import { message } from 'antd';
import { connect } from 'react-redux';

const Minimized = (props) => {
    const handleClickMaximize = () => {
        if (!!props.userId) {
            props.maximize();
        } else {
            message.warning('Vui lòng Đăng nhập để Chat với Admin!', 4);
        }
    };

    return (
        <div
            onClick={handleClickMaximize}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                background: '#0093FF',
                color: '#fff',
                borderRadius: '50%',
                cursor: 'pointer',
            }}
        >
            <IconButton color="#fff">
                <ChatIcon />
            </IconButton>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userId: state.auth.userId,
        openMaximize: state.chat.openMaximize,
    };
};

export default connect(mapStateToProps, null)(Minimized);
