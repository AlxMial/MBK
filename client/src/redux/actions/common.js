import { FETCH_LOADING, FETCH_SUCCESS ,BACKPAGE} from "redux/actionTypes";

export const fetchLoading = message => {
    return dispatch => {
        dispatch({
            type: FETCH_LOADING,
            payload: message || 'Loading...',
        });
    };
};

export const fetchSuccess = message => {
    return dispatch => {
        dispatch({
            type: FETCH_SUCCESS,
            payload: message || '',
        });
    };
};

export const backPage = message => {
    return dispatch => {
        dispatch({
            type: BACKPAGE,
            payload: message || '',
        });
    };
};