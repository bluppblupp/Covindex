import { persistenceUpdateWatchlist } from "../../firebasePersistence"

export const addToWatchlist = (country) => (dispatch, getState) => {
    dispatch({
        type: "addCountryToWatchlist",
        payload: country
    })
    dispatch(persistenceUpdateWatchlist())
}

export const populateWatchlist = (countries) => (dispatch, getState) => {
    dispatch({ type: "populateWatchlist", payload: countries })
    dispatch(persistenceUpdateWatchlist())
}


export const populateWatchlistFromFirebase = (countries) => (dispatch) => {
    dispatch({ type: "populateWatchlist", payload: countries })
}

export const clearWatchlist = () => {
    return {
        type: "clearWatchlist"
    }
}

export const removeFromWatchlist = (country) => (dispatch) => {
    dispatch({
        type: "removeCountryFromWatchlist",
        payload: country
    })
    dispatch(persistenceUpdateWatchlist())
}
