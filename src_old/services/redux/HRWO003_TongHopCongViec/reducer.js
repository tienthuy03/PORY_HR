import {
    HRWO003_RELOAD,
    HRWO003_RELOAD_S,
    HRWO003_RESET_RELOAD,
    HRWO003_RESET_RELOAD_S
} from "./action";

const initialState = {
    countReload: 0,
}

const reducer = (state = initialState, act) => {
    switch (act.type) {
        case HRWO003_RELOAD:
            return {
                ...state,
            }
        case HRWO003_RELOAD_S:
            return {
                countReload: state.countReload + 1,
            }
        case HRWO003_RESET_RELOAD:
            return {
                ...state,
            }
        case HRWO003_RESET_RELOAD_S:
            return {
                countReload: 0,
            }
        default:
            return state;
    }
}

export default reducer;