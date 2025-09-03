import {
    ITEM_QR_DEFAULT,
    ITEM_QR_DEFAULT_SUCCESS
} from '../actions/actionType'; 

import { put, takeLatest } from 'redux-saga/effects';

function* setQrDefault({ payload }) {
    try {
        yield put({
            type: ITEM_QR_DEFAULT_SUCCESS,
            payload: payload,
        });
    } catch (error) { }
}
export function* qrWalletSaga() {
    yield takeLatest(ITEM_QR_DEFAULT, setQrDefault);
}