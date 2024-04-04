const reservationSettingUrl = process.env.EXPO_PUBLIC_API_URL;

export const fetchReservationsettings = () => {
    return fetch(reservationSettingUrl + 'reservationsettings')
        .then(response => {
            if (!response.ok)
                throw new Error("Something went wrong: " + response.statusText);

            return response.json();
        })
        .catch(err => {
            console.error("Error fetching reservationsettings:", err);
            throw err;
        });
}

export const fetchSpecificReservationsetting = (id) => {
    return fetch(reservationSettingUrl + "reservationsettings/" + id)
        .then(response => {
            if (!response.ok)
                throw new Error("Something went wrong: " + response.statusText);

            return response.json();
        })
        .catch(err => {
            console.error("Error fetching reservationsetting:", err);
            throw err;
        });
}

export const fetchActiveReservationSetting = () => {
    return fetch(reservationSettingUrl + "reservationsettings/active")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch reservationsetting: " + response.statusText);
            }
            return response.json();
        })
        .catch(err => {
            throw new Error("Failed to fetch reservationsetting: " + err.message);
        });
}

export const activateReservationSetting = (id) => {
    return fetch(reservationSettingUrl + "reservationsettings/activate/" + id, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(id)
    })
        .then(response => {
            if (response.status === 200) {
                return { success: true };
            } else if (!response.ok) {
                throw new Error("Error in activation: " + response.statusText);
            } else {
                throw new Error("Unexpected response: " + response.status);
            }
        })
        .then(data => {
            console.log("Activated reservation setting:", id);
            return data;
        })
        .catch(err => {
            console.error(err);
            return { success: false };
        });
}

export const saveReservationSetting = (reservationsetting) => {
    return fetch(reservationSettingUrl + 'reservationsettings', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(reservationsetting)
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Addition failed: " + response.statusText);

            return { success: true };
        })
        .catch(err => {
            console.error(err);
            return { success: false };
        });
}

export const updateReservationSetting = (reservationsetting, id) => {
    return fetch(reservationSettingUrl + "resrvationsettings/" + id, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(reservationsetting)
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Error in edit: " + response.statusText);

            return { success: true, data: response.json() };
        })
        .catch(err => {
            console.error(err);
            return { success: false };
        });
}

export const deleteReservationSetting = (id) => {
    return fetch(reservationSettingUrl + "reservationsettings/" + id, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Error in delete: " + response.statusText);

            return { success: true };
        })
        .catch(err => console.error(err));
}