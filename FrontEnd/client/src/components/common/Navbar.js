import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AutoComplete, Input } from 'antd';
import { FaAlignRight, FaUserAlt, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { Link, withRouter } from 'react-router-dom';
import logo from '../../images/logodoan.png';
import { connect } from 'react-redux';
import { change_visible_button, logout } from '../../action/authAction';
import { update_search_key } from '../../action/productsAction';
import { convertNameUser } from '../../helper/convertNameUser';
import axiosInstance from '../../utils/axiosInstance';
import queryString from 'query-string';
import Notify from './Notify';
import ModalUI from '../AuthModal/ModalUI';
import SubNavbar from './SubNavbar';
import './userInfomation.css';

function Navbar(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [wordSearch, setWordSearch] = useState('');
    const [position, setPosition] = useState(window.location.pathname);
    const debounceRef = useRef(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleOnOKAuthModal = () => {};

    const handleOnCancelAuthModal = () => {
        props.change_visible_btn(false);
    };

    const handleSearchResult = async (query) => {
        const tempArray = await axiosInstance(`Product/search-products?${queryString.stringify({
            searchKey: query,
            categoryId: null, // Set your category ID here
            currentPage: 1,
            pageSize: 3,
        })}`, 'GET')
        .then((res) => res.data.products);

        return tempArray.map((e) => ({
            value: e.name,
            label: (
                <Link
                    to={{
                        pathname: '/search/',
                        search: queryString.stringify({
                            searchKey: e.name,
                            categoryId: null, // Set your category ID here
                            currentPage: 1,
                            pageSize: 3,
                        }),
                        hash: '#search-product',
                        state: { fromDashboard: window.location.pathname === '/' || '' ? true : false },
                    }}
                    rel="noopener noreferrer"
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{e.name}</span>
                    </div>
                </Link>
            ),
        }));
    };

    const handleSearch = async (value) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(async () => {
            setOptions(value ? await handleSearchResult(value) : []);
        }, 500);
    };

    const handleSearchRandom = (e) => {
        props.update_searchkey(e.target.value);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        props.logout();
        props.history.push('/');
    };

    const handleViewInfoUser = () => {
        props.history.push(`/Persional/${props.userId}`);
    };

    useEffect(() => {
        setPosition(window.location.pathname);
    }, []);

    useEffect(() => {
        if (position !== window.location.pathname) {
            if (window.location.pathname === '/' && position.includes('/search')) {
                props.update_searchkey('');
            }
            setPosition(window.location.pathname);
        }
    }, [position, props, props.update_searchkey]);

    return (
        <>
            <nav className="navbar">
                <div className="nav-center">
                    <div className="nav-header">
                        <Link to="/">
                            <img src={logo} style={{ width: 70, height: 70, margin: '-25px 0 0 70px' }} alt="beach resort" />
                        </Link>
                        <button type="button" className="nav-btn" onClick={handleToggle}>
                            <FaAlignRight className="nav-icon" />
                        </button>
                    </div>
                    <ul className={isOpen ? 'nav-links show-nav' : 'nav-links'}>
                        <li className="li-item">
                            <div className="search-body">
                                <AutoComplete
                                    dropdownMatchSelectWidth={252}
                                    style={{
                                        width: '100%',
                                        outline: 'none',
                                    }}
                                    options={options}
                                    onSearch={handleSearch}
                                    value={props.searchKey}
                                    onSelect={handleOnSelect}
                                >
                                    <Input onChange={handleSearchRandom} size="large" placeholder="Nhập từ khóa tìm kiếm" allowClear />
                                </AutoComplete>
                            </div>
                        </li>
                        <li className="li-item">
                            <Notify />
                        </li>
                        <li className="li-item" style={{ display: props.isAuthenticated ? 'none' : 'block' }}>
                            <Link to="#" onClick={handleShowAuthModal}>
                                <FaUserAlt />
                                Đăng nhập
                            </Link>
                        </li>
                        {props.isVisible ? <ModalUI visible={props.isVisible} onOKAuthModal={handleOnOKAuthModal} onCancelAuthModal={handleOnCancelAuthModal} /> : ''}
                        <li className="right" style={{ display: props.isAuthenticated ? 'block' : 'none' }}>
                            <div>
                                <span className="name-user">Chào {convertNameUser(props.nameUser) || 'Bạn'}...</span>
                                <Avatar alt="user" src={props.avatar || 'https://img1a.flixcart.com/www/linchpin/fk-cp-zion/img/profile-pic-male_2fd3e8.svg'} />
                                <div className="dropdown">
                                    <ul>
                                        <li>
                                            <Link onClick={handleViewInfoUser} to="#">
                                                <FaUserAlt style={{ fontSize: '12px' }} />
                                                <span>Thông tin Cá nhân</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#" onClick={handleLogout}>
                                                <FaSignOutAlt style={{ fontSize: '12px' }} />
                                                <span>Đăng xuất</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                        <li className="li-item">
                            <Link to="/Cart">
                                <FaShoppingCart />
                                Giỏ hàng
                                <span className="count-item">{props.count}</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <SubNavbar />
            </nav>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        userId: state.auth.userId,
        nameUser: state.auth.nameUser,
        role: state.auth.role,
        avatar: state.auth.avatar,
        isVisible: state.auth.isVisible,
        isAuthenticated: state.auth.isAuthenticated,
        count: state.carts.count,
        searchKey: state.products.searchKey,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        change_visible_btn: (data) => {
            dispatch(change_visible_button(data));
        },
        logout: () => {
            dispatch(logout());
        },
        update_searchkey: (searchKey) => {
            dispatch(update_search_key(searchKey));
        },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navbar));
