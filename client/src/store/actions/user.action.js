import * as Actions from '../actionTypes';

export function UserSignIn(id, email, token) {
    return {
        type: Actions.USER_SIGNIN,
        payload: { id, email, token}
    }
}

export function UserSignOut() {
    return {
        type: Actions.USER_SIGNOUT
    }
}