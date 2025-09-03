import {
    HRWO002_RELOAD,
    HRWO002_RELOAD_S,
    HRWO002_RESET_RELOAD,
    HRWO002_RESET_RELOAD_S
} from "./action";

const initialState = {
    countReload: 0,
}

const reducer = (state = initialState, act) => {
    switch (act.type) {
        case HRWO002_RELOAD:
            return {
                ...state,
            }
        case HRWO002_RELOAD_S:
            return {
                countReload: state.countReload + 1,
            }
        case HRWO002_RESET_RELOAD:
            return {
                ...state,
            }
        case HRWO002_RESET_RELOAD_S:
            return {
                countReload: 0,
            }
        default:
            return state;
    }
}

export default reducer;