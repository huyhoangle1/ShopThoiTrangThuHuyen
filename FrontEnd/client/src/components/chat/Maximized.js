import React, { useState, useEffect } from 'react';
import {
    TitleBar,
    IconButton,
    CloseIcon,
    MessageList,
    MessageGroup,
    Message,
    Bubble,
    MessageText,
    MessageButtons,
    TextComposer,
    Row,
    Fill,
    TextInput,
    SendButton,
    Fit,
    Badge,
} from '@livechat/ui-kit';
import * as signalR from '@microsoft/signalr';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import { message } from 'antd';
import { connect } from 'react-redux';

const Maximized = (props) => {
    const [hub, setHub] = useState(null);
    const [list, setList] = useState([]);
    const [connectionId, setConnectionId] = useState(null);
    const [receiverId, setReceiverId] = useState(null);

    useEffect(() => {
        const connectServerHub = () => {
            const token = localStorage.getItem('access_token')
                ? JSON.parse(localStorage.getItem('access_token'))
                : '';
            const hub = new signalR.HubConnectionBuilder()
                .withUrl('https://localhost:5001/chatHub', {
                    accessTokenFactory: () => `${token.value}`,
                })
                .configureLogging(signalR.LogLevel.Information)
                .build();

            setHub(hub);

            hub.start()
                .then(() => {
                    console.log('Success');
                    hub.invoke('GetConnectionId').then((connectionId) => {
                        setConnectionId(connectionId);
                    });

                    hub.on('ReceiveMessage', (message) => {
                        setList((prevList) => [...prevList, message]);
                    });

                    hub.on('UpdateUserList', (_connections) => {
                        console.log('connection: ', _connections);
                    });

                    hub.on('UserOnlineList', (userOnlineList) => {
                        console.log('user online: ', userOnlineList);
                    });
                })
                .catch(() => console.log('fail'));
        };

        if (props.userId) {
            axiosInstance('Chat/GetMessages', 'POST', {
                senderId: props.userId,
                receiverId,
            }).then((res) => {
                if (res.data.length > 0) {
                    setList(res.data);
                }
            });

            connectServerHub();
        } else {
            message.warning('Vui lòng Đăng nhập để Chat với Admin!', 4);
            props.minimize();
        }

        return () => {
            if (hub) {
                hub.stop();
            }
        };
    }, [props.userId, receiverId]);

    const onMessageSend = (value) => {
        if (props.userId) {
            if (props.role === 'Admin' && !receiverId) {
                message.warning('Vui lòng chọn đối tượng để chat!', 4);
                return;
            }

            hub.invoke('SendMessage', {
                content: value,
                senderId: props.userId,
                connectionId,
                receiverId,
            });
        } else {
            message.warning('Vui lòng Đăng nhập để Chat với Admin!', 4);
        }
    };

    const clickReplyUser = (user) => {
        setReceiverId(user.id);
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <TitleBar
                style={{ paddingLeft: '20px' }}
                key={1}
                leftIcons={[
                    <Badge key="active" color="green" status="processing" />,
                ]}
                rightIcons={[
                    <IconButton key="close" onClick={props.minimize}>
                        <CloseIcon />
                    </IconButton>,
                ]}
                title="WELCOME TO ONLINE SHOP"
            ></TitleBar>
            <div
                style={{
                    flexGrow: 1,
                    minHeight: 0,
                    height: '100%',
                }}
            >
                <MessageList active containScrollInSubtree>
                    {list.length === 0 ? (
                        <Message
                            date={moment().format('hh:mm DD/MM/YYYY')}
                            authorName="BOT"
                            authorOpened={true}
                            isOwn={false}
                            key={1}
                        >
                            <Bubble isOwn={false}>
                                <MessageText style={{ padding: '0.5em' }}>
                                    {'Can I help you ?'}
                                </MessageText>
                            </Bubble>
                        </Message>
                    ) : (
                        list.map((ele) => (
                            <MessageGroup
                                avatar={
                                    ele.receiverId === props.userId
                                        ? ele.sender.avatar ||
                                          'https://img1a.flixcart.com/www/linchpin/fk-cp-zion/img/profile-pic-male_2fd3e8.svg'
                                        : null
                                }
                                key={ele.id}
                                onlyFirstWithMeta
                            >
                                <Message
                                    style={{ padding: 0 }}
                                    date={moment(ele.createDate).format('hh:mm DD/MM/YYYY')}
                                    authorName={
                                        props.userId !== ele.senderId
                                            ? ele.sender.displayname + ' - '
                                            : 'Me - '
                                    }
                                    isOwn={ele.senderId === props.userId}
                                >
                                    <Bubble isOwn={ele.senderId === props.userId}>
                                        <MessageText style={{ padding: '0.5em', minWidth: 100 }}>
                                            {ele.content}
                                        </MessageText>
                                    </Bubble>
                                </Message>
                                <MessageButtons
                                    onClick={() => clickReplyUser(ele.sender)}
                                    style={
                                        (ele.senderId === props.userId &&
                                            ele.receiver.displayname === 'Admin') ||
                                        props.userId === ele.senderId
                                            ? { display: 'none' }
                                            : {
                                                  display: 'inline-block',
                                                  textAlign: 'center',
                                                  fontWeight: 'bold',
                                                  border: '1px solid #91d5ff',
                                                  fontSize: 10,
                                                  borderRadius: 5,
                                                  width: 50,
                                                  color: '#91d5ff',
                                                  cursor: 'pointer',
                                              }
                                    }
                                >
                                    Reply
                                </MessageButtons>
                            </MessageGroup>
                        ))
                    )}
                </MessageList>
            </div>
            <TextComposer onSend={onMessageSend}>
                <Row align="center">
                    <Fill>
                        <TextInput />
                    </Fill>
                    <Fit>
                        <SendButton fit />
                    </Fit>
                </Row>
            </TextComposer>
            <div
                style={{
                    textAlign: 'center',
                    fontSize: '.6em',
                    padding: '.4em',
                    background: '#fff',
                    color: '#888',
                }}
            >
                {'Powered by Online Shop'}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        userId: state.auth.userId,
        role: state.auth.role,
    };
};

export default connect(mapStateToProps, null)(Maximized);
