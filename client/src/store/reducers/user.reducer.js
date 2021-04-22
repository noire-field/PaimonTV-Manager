const initState = {
    auth: false
}

const reducer = function(state = initState, action) {
    switch(action.type) {
        case 'SET_AUTH': 
            return {
                ...state,
                auth: action.payload
            }
            break;
        default: return state;
    }
}

export default reducer;