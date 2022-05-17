import { FETCH_LOADING, FETCH_SUCCESS } from "redux/actionTypes";

const INIT_STATE = {
    loading: false,
    message: ''
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {

        case FETCH_LOADING: {
            return { ...state, message: action.payload, loading: true };
        }

        case FETCH_SUCCESS: {
            return { ...state, message: action.payload, loading: false };
        }

        default:
            return state;
    }
};