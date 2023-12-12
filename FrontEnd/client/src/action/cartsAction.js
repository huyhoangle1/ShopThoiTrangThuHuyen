import {ADD_TO_CART,REMOVE_ITEM,SUB_QUANTITY,ADD_QUANTITY,CREATE_ORDER_ERROR, CREATE_ORDER_LOADING, CREATE_ORDER_SUCCESS, UPDATE_QUANTITY} 
from './action-types/carts-actions';
import * as orderApis from '../api/order.api';

// thêm giỏ hàng
export const addToCart = (item)=>{
    return{
        type: ADD_TO_CART,
        payload: item}
    }
//xóa cart item
export const removeItem = (id)=>{
    return{
        type: REMOVE_ITEM,
        payload: id
    }
}
//giảm quantity cart item
export const subtractQuantity=(id)=>{
    return{
        type: SUB_QUANTITY,
        payload: id
    }
}

export const updateQuantity=(id, number)=>{
    return{
        type: UPDATE_QUANTITY,
        payload: {"id": id, "number": number}
    }
}
//tăng quantity cart item
export const addQuantity=(id)=>{
    return{
        type: ADD_QUANTITY,
        payload: id
    }
}
//checkout
export const handle_checkout_cart = (order) => {
    return dispatch => {
        dispatch(create_order_loading());
        orderApis.createOrder(order)
        .then(res => {
            dispatch(create_order_success(res.data));
        })
        .catch(error => {
            console.log(error?.response?.data);
            dispatch(create_order_error(error?.response?.data));
        })
    }
}
export const create_order_loading = () => {
    return{
        type: CREATE_ORDER_LOADING,
        
    }
}
export const create_order_success = (data) => {
    return{
        type: CREATE_ORDER_SUCCESS,
        payload: data
    }
}
export const create_order_error = (err) => {
    return{
        type: CREATE_ORDER_ERROR,
        payload: err
    }
}