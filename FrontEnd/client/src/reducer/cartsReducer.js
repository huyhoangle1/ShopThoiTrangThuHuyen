//action of carts
import { ADD_TO_CART, REMOVE_ITEM, ADD_QUANTITY, SUB_QUANTITY, CREATE_ORDER_ERROR, CREATE_ORDER_LOADING, CREATE_ORDER_SUCCESS, UPDATE_QUANTITY }
    from '../action/action-types/carts-actions';
//
import * as ParsePrice from '../helper/parsePriceForSale';
import { message } from 'antd';

//local storage
function getCartsFromLocalStorage() {
    return localStorage.getItem("carts") ? JSON.parse(localStorage.getItem("carts")) : []
}
function SaveCartsToLocalStorage(carts) {
    return carts ? localStorage.setItem("carts", JSON.stringify(carts)) : null;
}
function returnTotal() {
    let tempCarts = getCartsFromLocalStorage();
    return tempCarts.reduce((total, ele) => {
        return total += (ele.price * ele.quantity * (1 - (ele.sale / 100)))
    }, 0) || 0;
}
const initState = {

    carts: getCartsFromLocalStorage(),
    total: returnTotal(),
    count: getCartsFromLocalStorage().length,
    isLoading: false,
}
const cartsReducer = (state = initState, action) => {

    //
    switch (action.type) {
        case ADD_TO_CART:
            {
                //có 2 TH xảy ra: item này đã có ta chỉ việc tăng quantity + 1 | và item này mới hoàn toàn
                // ta dùng existed_item là cờ. || action.payload là 1 object
                let existed_item = state.carts.find(item => action.payload.id === item.id)
                //TH1: cái item này đã tồn tại
                if (existed_item) {
                    existed_item.quantity += action.payload.quantity;
                    //clone nó ra và lưu local storage
                    let tempCarts = [...state.carts];
                    SaveCartsToLocalStorage(tempCarts);

                    return {
                        ...state,
                        total: state.total + ParsePrice.priceAfterSaleNotParseToMoney(existed_item.price * action.payload.quantity, existed_item.sale)
                    }
                }
                else {
                    let newCart = { ...action.payload }
                    //newCart.quantity = 1;
                    let tempCarts = [...state.carts];
                    tempCarts.push(newCart)
                    SaveCartsToLocalStorage(tempCarts);
                    return {
                        ...state,
                        carts: [...state.carts, newCart],
                        total: state.total + ParsePrice.priceAfterSaleNotParseToMoney(newCart.price * action.payload.quantity, newCart.sale),
                        count: state.count + 1,
                    }
                }


            }
        case REMOVE_ITEM:
            {
                //lấy ra item muốn xóa dựa trên id
                let itemRemove = state.carts.find(item => item.id === action.payload);
                //lấy ra danh sách khi ko còn item đang xóa dùng filter
                let new_items = state.carts.filter(item => action.payload !== item.id);
                //cập nhập lại total
                let newTotal = state.total - ParsePrice.priceAfterSaleNotParseToMoney((itemRemove.quantity * itemRemove.price), itemRemove.sale);
                //lưa local storage
                SaveCartsToLocalStorage(new_items);
                //state mới trả ra
                return {
                    ...state,
                    carts: new_items,
                    total: newTotal,
                    count: state.count - 1,
                }
            }
        case ADD_QUANTITY:
            {
                //lấy ra cái item muốn tăng quantity, dùng find thì get ra item nếu thay đổi nó thì cái item
                //đó trong mảng carts sẽ thay đổi quantity theo -> not pure fucntion
                let incItem = state.carts.find(item => item.id === action.payload);

                incItem.quantity += 1;

                let newTotal = state.total + ParsePrice.priceAfterSaleNotParseToMoney(incItem.price, incItem.sale);
                //clone cái carts
                let tempCarts = [...state.carts];
                SaveCartsToLocalStorage(tempCarts)
                return {
                    ...state,
                    carts: [...tempCarts],
                    total: newTotal,
                }
            }
        case SUB_QUANTITY:
            {
                let decItem = state.carts.find(item => item.id === action.payload);
                decItem.quantity -= 1;
                let newTotal = state.total - ParsePrice.priceAfterSaleNotParseToMoney(decItem.price, decItem.sale);
                //
                let tempCarts = [...state.carts];
                SaveCartsToLocalStorage(tempCarts);
                return {
                    ...state,
                    carts: [...tempCarts],
                    total: newTotal,
                }
            }
            case UPDATE_QUANTITY: {
                const { id, number } = action.payload; // id của sản phẩm và số lượng mới từ action
            
                let updatedCarts = [...state.carts];
                let updatedItem = updatedCarts.find(item => item.id === id);
            
                if (updatedItem) {
                    const oldQuantity = updatedItem.quantity; // Lưu số lượng cũ
                    updatedItem.quantity = number; // Cập nhật số lượng mới cho sản phẩm
            
                    // Tính toán giá trị sau khi cập nhật số lượng
                    const priceAfterSale = ParsePrice.priceAfterSaleNotParseToMoney(updatedItem.price, updatedItem.sale);
                    const totalPriceDifference = priceAfterSale * (number - oldQuantity);
                    let newTotal = state.total + totalPriceDifference;
            
                    SaveCartsToLocalStorage(updatedCarts); // Lưu lại giỏ hàng mới vào local storage
            
                    return {
                        ...state,
                        carts: updatedCarts,
                        total: newTotal,
                    };
                }
                // Trả về state ban đầu nếu không tìm thấy sản phẩm cần cập nhật
                return state;
            }
        case CREATE_ORDER_LOADING: {
            return {
                ...state,
                isLoading: true,
            }
        }
        case CREATE_ORDER_SUCCESS: {

            message.success(`${action.payload}`, 5)
            localStorage.removeItem('carts')
            return {
                carts: [],
                total: 0,
                count: 0,
                isLoading: false,
            }
        }
        case CREATE_ORDER_ERROR: {
            const errorMessage = action.payload ? action.payload : 'Có lỗi xảy ra khi tạo đơn hàng.';
            message.error(errorMessage);
            return {
                ...state,
                isLoading: false,
            }
        }
        default:
            return state;
    }

}

export default cartsReducer