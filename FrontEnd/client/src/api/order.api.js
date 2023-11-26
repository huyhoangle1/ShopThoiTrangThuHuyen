import axiosInstance from '../utils/axiosInstance';

const pathCreateOrder = "Order";
const qrMomo = "Order/qrmomo"


export const createOrder = order => {
    return axiosInstance(pathCreateOrder, 'POST', order)
}


export const paymentQrMomo = (data) => {
    console.log(data);
    return axiosInstance(qrMomo, "POST", data)
}