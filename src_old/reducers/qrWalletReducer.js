import {
    ITEM_QR_DEFAULT,
    ITEM_QR_DEFAULT_SUCCESS,
    ITEM_QR_DEFAULT_FAILED,
} from '../actions/actionType'

const initData = {
    data: {},
    error: ''
};

const qrWalletReducer = (qrWallet = initData, action) => {
    switch (action.type) {
        case ITEM_QR_DEFAULT:
            return {
                ...qrWallet,
            };
        case ITEM_QR_DEFAULT_SUCCESS:
            return {
                data: action.payload,
                error: 'no',
            };
        case ITEM_QR_DEFAULT_FAILED:
            return {
                ...qrWallet,
                data: {},
                error: 'Lỗi ở qrWalletReducer',
            };
        default:
            return qrWallet;
    }
};

export default qrWalletReducer;