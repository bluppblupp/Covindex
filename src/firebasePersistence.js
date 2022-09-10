import { setCountryFromFirebase } from "./redux/actions/countryActions";
import { populateWatchlistFromFirebase } from "./redux/actions/watchlistActions";

export const persistenceUpdateCurrent = () => (dispatch, getState, { getFirebase }) => {

    const firebase = getFirebase()
    const userId = getState().firebase.auth.uid
    if (userId) {
        const currentCountry = getState().country.currentCountry
        firebase.database().ref(`top/${userId}/current`).set({
            current: currentCountry
        })
    }
}

export const persistenceUpdateWatchlist = () => (dispatch, getState, { getFirebase }) => {

    const firebase = getFirebase()
    const userId = getState().firebase.auth.uid
    if (userId) {
        const watchlistCountries = getState().watchlist.watchlist
        firebase.database().ref(`top/${userId}/watchlist`).set({
            watchlist: watchlistCountries
        })
    }
}


export const updateFromFirebase = () => (dispatch, getState) => {
    const data = getState().firebase.data
    const uid = getState().firebase.auth.uid
    if (uid) {
        if (uid in data.top) {
            const userData = data.top[uid]
            userData?.current?.current ? dispatch(setCountryFromFirebase(userData.current.current)) : dispatch(setCountryFromFirebase(null));
            userData?.watchlist?.watchlist ? dispatch(populateWatchlistFromFirebase(userData.watchlist.watchlist)) : dispatch(populateWatchlistFromFirebase([]))
        }
        else {
            dispatch(setCountryFromFirebase(null))
            dispatch(populateWatchlistFromFirebase([]))
        }
    }
}