import * as Actions from './../actionTypes';

const initState = {
    auth: false,
    guestMode: false,
    user: {
        id: "",
        email: "",
        token: ""
    }
}

const reducer = function(state = initState, action) {
    switch(action.type) {
        case Actions.USER_SIGNIN:
            return {
                ...state,
                auth: true,
                user: {
                    id: action.payload.id,
                    email: action.payload.email,
                    token: action.payload.token,
                }
            }
        case Actions.USER_SIGNOUT:
            return {
                ...state,
                auth: false,
                user: {
                    id: "",
                    email: "",
                    token: "",
                }
            }
        case Actions.USER_GUESTSIGNIN:
            return {
                ...state,
                auth: true,
                guestMode: true,
                user: {
                    id: "guest",
                    email: "Guest",
                    token: "guest",
                }
            }

        default: return state;
    }
}

export default reducer;