import {
    HRWO004_RELOAD,
    HRWO004_RELOAD_S,
    HRWO004_RESET_RELOAD,
    HRWO004_RESET_RELOAD_S
} from "./action";

const initialState = {
    countReload: 0,
}

const reducer = (state = initialState, act) => {
    switch (act.type) {
        case HRWO004_RELOAD:
            return {
                ...state,
            }
        case HRWO004_RELOAD_S:
            return {
                countReload: state.countReload + 1,
            }
        case HRWO004_RESET_RELOAD:
            return {
                ...state,
            }
        case HRWO004_RESET_RELOAD_S:
            return {
                countReload: 0,
            }
        default:
            return state;
    }
}

export default reducer;