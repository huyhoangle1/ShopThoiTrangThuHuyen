import React, { useState, useEffect } from 'react';
import empty from '../../images/empty.jpg';
import './detail.css';
import { Tag, notification, Skeleton, Descriptions, Badge, Rate } from 'antd';
import { PlusOutlined, MinusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { addToCart } from '../../action/cartsAction';
import axiosInstance from '../../utils/axiosInstance';
import * as parsePriceForSale from '../../helper/parsePriceForSale';
import { colors } from '../../utils/colors';
import { sizes } from '../../utils/sizes';
import { TranslateColor } from '../../utils/translate';

const Detail = ({ productId, addToCart }) => {
    const [countItem, setCountItem] = useState(1);
    const [product, setProduct] = useState({});
    const [isMounted, setIsMounted] = useState(false);
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        axiosInstance(`Product/get-product-by-id/${productId}`)
            .then(res => {
                setProduct({ ...res.data });
                setIsMounted(true);
                setMainImage(res.data.images ? res.data.images[0].urlImage : empty);
            });
    }, [productId]);

    const handleClickSubImage = (e) => {
        setMainImage(e.target.src);
    };

    const handleAddCartBtn = (product) => {
        notification.open({
            message: 'Thêm giỏ hàng thành công!',
            duration: 3,
            icon: <CheckCircleOutlined style={{ color: '#5cb85c' }} />,
            placement: 'topLeft'
        });
        addToCart({ ...product, quantity: countItem });
    };

    const handleDecreasingBtn = () => {
        if (countItem >= 2) {
            setCountItem(countItem - 1);
        }
    };

    const handleIncreasingBtn = () => {
        setCountItem(countItem + 1);
    };

    // Rest of your JSX and rendering logic remains the same

    return (
        <>
            {isMounted ? (
                <><article className="detail-product">
                <div className="img-detail-product">
                    <div className="sub-img-product" >
                        {
                            product.images ?
                                (
                                    product.images.map((ele, index) => {
                                        return <img key={ele.id} onClick={(e) => this.handleClickSubImage(e)}
                                            src={ele.urlImage} className="sub-img-detail-product" alt="sub img"></img>
                                    })

                                )
                                : (<>
                                    <img onClick={(e) => this.handleClickSubImage(e)}
                                        src={empty} className="sub-img-detail-product" alt="sub img"></img>

                                    <img onClick={(e) => this.handleClickSubImage(e)}
                                        src={empty} className="sub-img-detail-product" alt="sub img"></img>

                                    <img onClick={(e) => this.handleClickSubImage(e)}
                                        src={empty} className="sub-img-detail-product" alt="sub img"></img>

                                    <img onClick={(e) => this.handleClickSubImage(e)}
                                        src={empty} className="sub-img-detail-product" alt="sub img"></img>

                                    <img onClick={(e) => this.handleClickSubImage(e)}
                                        src={empty} className="sub-img-detail-product" alt="sub img"></img>
                                </>
                                )
                        }
                        {
                            product.images ?
                                renderEmptyImages(5 - product.images.length) : ""


                        }


                    </div>
                    <div className="main-img-product">
                        <img width='370' height="370" src={mainImage ? mainImage : empty}
                            className="main-img-detail-product" alt="main img" />
                    </div>

                </div>
                <div className="info-detail-product">
                    <div className="body-info-detail-product">
                        <div>
                            <h2 style={{ color: '#af9a7d' }}>{product.name}</h2>
                        </div>
                        <div className="title-detail-item">
                            <span className="title-detail"><b>Nhà sản xuất:</b></span><span>
                                {product.provider ? product.provider.name : 'Không'}</span>

                        </div>
                        <hr />

                        <div className="title-detail-item">
                            <span className="title-detail"><b>Giá:</b></span>
                            <span style={{ color: '#f5222d', fontSize: '18px' }}><b>{parsePriceForSale.parsePriceSale(product.price, product.sale) || 0} đ</b></span>
                        </div>
                        <div className="title-detail-item">
                            <span className="title-detail"><b>Giá thị trường:</b></span><span style={{ fontSize: '18px', textDecoration: 'line-through' }}>
                                {parsePriceForSale.parsePrice(product.price) || 0}<b> đ</b></span>
                        </div>
                        <div className="title-detail-item">
                            <span className="title-detail"><b>Size:</b></span><Tag color="default"><b>{sizes[product.size]}</b></Tag>
                        </div>
                        <div className="title-detail-item">
                            <span className="title-detail"><b>Màu sắc:</b></span><Tag color={colors[product.color]}><b>
                                {TranslateColor(product.color)}</b></Tag>
                        </div>
                        <div className="title-detail-item">
                            <span className="title-detail"><b>Số lượng:</b></span>
                            <div style={{ border: '2px solid gray', display: 'flex', fontWeight: 'bold' }}>
                                <div className="mount-item" onClick={() => this.handleDecreasingBtn()}
                                    style={{ width: '32px', borderRight: '2px solid gray' }}>
                                    <MinusOutlined></MinusOutlined>
                                </div>
                                <div className="mount-item" style={{ width: '30px' }}><span>{this.state.countItem}</span></div>
                                <div className="mount-item" onClick={() => this.handleIncreasingBtn()}
                                    style={{ width: '32px', borderLeft: '2px solid gray' }}>
                                    <PlusOutlined></PlusOutlined>
                                </div>
                            </div>
                        </div>
                        <div className="add-cart-detail-page">
                            <button className="add-cart-btn-detail-page" onClick={() => this.handleAddCartBtn(product)}>
                                Thêm giỏ hàng
                        </button>
                        </div>
                    </div>
                </div>
            </article>
                    <Descriptions title="Thông tin sản phẩm" layout="vertical" bordered>
                        <Descriptions.Item className="bold-text" label="Sản phẩm">{product.name}</Descriptions.Item>
                        <Descriptions.Item className="bold-text" label="Nhà sản xuất">{product.provider.name}</Descriptions.Item>
                        <Descriptions.Item className="bold-text" label="Danh mục">{product.category.generalityName}</Descriptions.Item>
                        
                        <Descriptions.Item className="bold-text" label="Mô tả" span={2}>
                        <ul style={{marginLeft: '10px'}}>
                            {
                                product.description.split(';').map((ele, id) => {
                                    return <li key={id}>{ele}</li>
                                })
                            }
                        </ul>
                        </Descriptions.Item>
                        <Descriptions.Item className="bold-text" label="Trạng thái"><Badge status="processing" text="Còn hàng" /></Descriptions.Item>
                    </Descriptions>
                    <br></br>
            </>
            ) : (
                <Skeleton />
            )}
        </>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        addToCart: (item) => {
            dispatch(addToCart(item));
        }
    };
};

export default connect(null, mapDispatchToProps)(Detail);
