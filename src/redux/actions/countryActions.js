import config from "../../config/covidApiConfig";
import vacConfig from "../../config/vaccinatedDataConfig"
import axios from "axios";
import dateformat from "dateformat";
import { persistenceUpdateCurrent } from "../../firebasePersistence";

export const setCountry = (country) => (dispatch, getState) => {
    if (getState().country.currentCountry === country) return;
    if (Object.keys(getState().country.listOfCountries).length === 0 && !getState().country.loadingCountries) {
        dispatch(getListOfCountries())
    }
    dispatch({
        type: "setCountry",
        payload: country
    })
    dispatch(persistenceUpdateCurrent())
}

export const setCountryFromFirebase = country => (dispatch, getState) => {
    if (Object.keys(getState().country.listOfCountries).length === 0 && !getState().country.loadingCountries) {
        dispatch(getListOfCountries())
    }
    dispatch({
        type: "setCountry",
        payload: country
    })
}
const sortCountries = (a, b) => {
    return (a.name < b.name) ? -1 : (b.name < a.name) ? 1 : 0
}
export const getListOfCountries = () => async (dispatch, getState) => {
    if (Object.keys(getState().country.listOfCountries).length === 0 && !getState().country.loadingCountries) {
        if (!getState().country.loadingCountries) {
            dispatch({
                type: "startSearchListOfCountries"
            })
            const options = {
                method: "GET",
                url: config.regionsUrl,
                params: {},
                headers: config.headers
            }
            try {
                const response = await axios.request(options)
                const filteredCountries = response.data.data.filter(country => (
                    country.name !== "Cruise Ship"
                    && country.name !== "Diamond Princess"
                    && country.name !== "MS Zaandam"
                    && country.name !== "Others"
                    && country.name !== "Reunion"
                ))
                const sortedCountries = filteredCountries.sort(sortCountries)
                const sortedCountriesObject = sortedCountries.reduce((obj, item) => (obj[item.iso] = item.name, obj), {})
                dispatch({
                    type: "getListOfCountries",
                    payload: sortedCountriesObject
                })
            }
            catch (e) {
                dispatch({
                    type: "listOfCountriesError",
                    payload: e.message
                })
            }
        }
    }
}
export const refreshCurrentData = (country) => async (dispatch) => {
    dispatch({
        type: "removeSelectedCountry",
        payload: country
    })
    dispatch({
        type: "clearCurrentData",
        payload: country
    })
    await dispatch(getCurrentData(country))
    dispatch({
        type: "addSelectedCountry",
        payload: country
    })
}
export const getCurrentData = (country) => async (dispatch, getState) => {
    if ((!getState().country.currentData[country] && country && !getState().country.loadingCurrent[country])) {
        dispatch({
            type: "startSearchCurrentData",
            payload: country
        })
        const options = {
            method: "GET",
            url: config.countryUrl,
            params: { iso: country },
            headers: config.headers
        }
        const vacOptions = {
            method: "GET",
            url: vacConfig.homeUrl,
            params: { iso: country },
            headers: vacConfig.headers
        }
        try {
            const response = await axios.request(options)
            const vacResponse = await axios.request(vacOptions)
            const vacdata = vacResponse.data.slice(-1)[0];
            const aggregatedData = {
                countryName: '',
                confirmed: 0,
                deaths: 0,
                confirmed_diff: 0,
                deaths_diff: 0,
                vaccinated: 0,
                vaccinated_per_hundred: 0,
                last_update: null
            }
            if (response.data.data.length) {
                aggregatedData.countryName = response.data.data[0].region.name;
                aggregatedData.last_update = response.data.data[0].last_update
                response.data.data.forEach((region) => {
                    aggregatedData.confirmed += region.confirmed;
                    aggregatedData.deaths += region.deaths;
                    aggregatedData.confirmed_diff += region.confirmed_diff;
                    aggregatedData.deaths_diff += region.deaths_diff;
                })
            } else {
                aggregatedData.confirmed = "no data";
                aggregatedData.deaths = 'no data';
                aggregatedData.confirmed_diff = 'no data';
                aggregatedData.deaths_diff = 'no data';
            }
            if (!vacdata || isNaN(parseInt(vacdata.people_fully_vaccinated))) {
                aggregatedData.vaccinated = 'no data';
                aggregatedData.vaccinated_per_hundred = 'no data';
            }
            else if (vacdata.iso_code !== country) {
                aggregatedData.vaccinated = "API error";
                aggregatedData.vaccinated_per_hundred = 'API error';
            }
            else {
                aggregatedData.vaccinated += parseInt(vacdata.people_fully_vaccinated);
                aggregatedData.vaccinated_per_hundred += parseFloat(vacdata.people_fully_vaccinated_per_hundred);
            }
            dispatch({
                type: "getCurrentData",
                payload: [country, aggregatedData]
            })
        }
        catch (e) {
            dispatch({
                type: "countryError",
                payload: [e.message, country]
            })
        }
    }
}

export const getMonthlyData = (country) => async (dispatch, getState) => {
    if (
        !getState().country.monthlyData[country] &&
        country &&
        !getState().country.loadingMonthly[country]
    ) {
        dispatch({
            type: "startSearchMonthlyData",
            payload: country,
        });
        const date = new Date();
        date.setDate(date.getDate() - 2);
        let options = {
            method: "GET",
            url: config.countryUrl,
            params: {
                iso: country,
                date: "",
            },
            headers: config.headers,
        };
        try {
            const monthlyData = {};
            for (let i = 0; i < 15; i++) {
                options = {
                    ...options,
                    params: { ...options.params, date: dateformat(date, "isoDate") },
                };
                const response = await axios.request(options);
                const aggregatedData = {
                    confirmed: 0,
                    deaths: 0,
                    confirmed_diff: 0,
                    deaths_diff: 0,
                };
                response.data.data.forEach((region) => {
                    aggregatedData.confirmed += region.confirmed;
                    aggregatedData.deaths += region.deaths;
                    aggregatedData.confirmed_diff += region.confirmed_diff;
                    aggregatedData.deaths_diff += region.deaths_diff;
                });
                monthlyData[date] = aggregatedData;
                date.setDate(date.getDate() - 2);
            }
            dispatch({
                type: "getMonthlyData",
                payload: [country, monthlyData],
            });
        } catch (e) {
            dispatch({
                type: "countryError",
                payload: e.message,
            });
        }
    }
};

export const getSixMonthData = (country) => async (dispatch, getState) => {
    if (
        !getState().country.sixMonthData[country] &&
        country &&
        !getState().country.loadingSixMonth[country]
    ) {
        dispatch({
            type: "startSearchSixMonthData",
            payload: country,
        });
        const date = new Date();
        date.setDate(date.getDate() - 2);
        let options = {
            method: "GET",
            url: config.countryUrl,
            params: {
                iso: country,
                date: dateformat(date, "isoDate"),
            },
            headers: config.headers,
        };
        try {
            const sixMonthData = {};
            for (let i = 0; i < 15; i++) {
                options = {
                    ...options,
                    params: { ...options.params, date: dateformat(date, "isoDate") },
                };
                const response = await axios.request(options);
                const aggregatedData = {
                    confirmed: 0,
                    deaths: 0,
                    confirmed_diff: 0,
                    deaths_diff: 0,
                };
                response.data.data.forEach((region) => {
                    aggregatedData.confirmed += region.confirmed;
                    aggregatedData.deaths += region.deaths;
                    aggregatedData.confirmed_diff += region.confirmed_diff;
                    aggregatedData.deaths_diff += region.deaths_diff;
                });
                sixMonthData[date] = aggregatedData;
                date.setDate(date.getDate() - 12);
            }
            dispatch({
                type: "getSixMonthData",
                payload: [country, sixMonthData],
            });
        } catch (e) {
            dispatch({
                type: "countryError",
                payload: e.message,
            });
        }
    }
};

export const addSelectedCountry = (country) => (dispatch) => {
    dispatch({
        type: "addSelectedCountry",
        payload: country,
    });
};

export const removeSelectedCountry = (country) => (dispatch) => {
    dispatch({
        type: "removeSelectedCountry",
        payload: country,
    });
};
