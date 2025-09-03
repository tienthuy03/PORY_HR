import {
    HRWO001_RELOAD_DANHSACH,
    HRWO001_RELOAD_SUCCESS
} from "./action";

const initialState = {
    isReload: false,
    countReload: 0,
}

const reducer = (state = initialState, act) => {
    switch (act.type) {
        case HRWO001_RELOAD_DANHSACH:
            return {
                ...state,
            }
        case HRWO001_RELOAD_SUCCESS:
            return {
                isReload: true,
                countReload: state.countReload + 1,
            }
        default:
            return state;
    }
}

export default reducer;