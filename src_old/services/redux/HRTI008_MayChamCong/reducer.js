import {
    HRTI008_RELOAD_LIST_MCC,
    HRTI008_RELOAD_LIST_MCC_S,
    HRTI008_RELOAD_LIST_MCC_F,
} from "./action";

const initialState = {
    isReload: false,
    countReload: 0,
}

const reducer = (state = initialState, act) => {
    switch (act.type) {
        case HRTI008_RELOAD_LIST_MCC:
            return {
                ...state,
            }
        case HRTI008_RELOAD_LIST_MCC_S:
            return {
                isReload: true,
                countReload: state.countReload + 1,
            }
        case HRTI008_RELOAD_LIST_MCC_F:
            return {
                isReload: false,
                countReload: state.countReload + 1,
            }
        default:
            return state;
    }
}

export default reducer;

