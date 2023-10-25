import React, { useState, useEffect } from 'react';
import Product from './Product';
import './listProducts.css';
import { connect } from 'react-redux';
import { addToCart } from '../../action/cartsAction';
import { notification, Button, Skeleton, Pagination } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const ListProducts = ({
  title,
  products,
  loading,
  isViewMore,
  pageCurrent,
  pageSize,
  totalPage,
  addToCart,
  onClickViewMore,
  onChangePage,
}) => {
  const handleAddToCart = (item) => {
    notification.open({
      message: 'Thêm giỏ hàng thành công!',
      duration: 1,
      icon: <CheckCircleOutlined style={{ color: '#5cb85c' }} />,
      placement: 'topLeft',
    });
    addToCart({ ...item, quantity: 1 });
  };

  const handleClickViewMore = () => {
    onClickViewMore(true);
  };

  const handleChangePage = (page, pageSize) => {
    onChangePage(page, pageSize);
  };

  return (
    <>
      <h4 style={{ maxWidth: '75%', margin: '20px auto' }}>{title}</h4>

      <div className="listProduct">
        <Skeleton style={{ width: '100%', border: '1px solid red' }} loading={loading} active>
          {products.map((ele) => (
            <Product key={ele.id} addToCart={handleAddToCart} product={{ ...ele }}></Product>
          ))}
        </Skeleton>
      </div>
      <br></br>
      <div style={{ textAlign: 'center' }}>
        {isViewMore ? (
          <Pagination
            current={pageCurrent}
            pageSize={pageSize}
            total={totalPage}
            onChange={handleChangePage}
          ></Pagination>
        ) : (
          <Button disabled={loading} onClick={handleClickViewMore}>
            Xem thêm
          </Button>
        )}
      </div>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item) => {
      dispatch(addToCart(item));
    },
  };
};

export default connect(null, mapDispatchToProps)(ListProducts);
