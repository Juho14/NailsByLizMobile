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
            if (!response.ok) {
                throw new Error("Failed to fetch reservation: " + response.statusText);
            }
            return response.json();
        })
        .catch(err => {
            throw new Error("Failed to fetch reservation: " + err.message);
        });
}

export const fetchActiveReservationsetting = () => {
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


export const saveReservationSetting = (reservationsetting) => {
    return fetch(reservationSettingUrl + '/reservationsettings', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(reservationsetting)
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Addition failed: " + response.statusText);

            return response.json();
        })
        .catch(err => console.error(err))
}

export const updateReservationSetting = (reservationsetting, link) => {
    return fetch(link, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(reservationsetting)
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Error in edit: " + response.statusText);

            return response.json();
        })
        .then(data => {
            console.log("Updated customer data:", data);
            return data;
        })
        .catch(err => console.error(err));
};



export const deleteReservationSetting = (url) => {
    return fetch(url, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Error in delete: " + response.statusText);
        })
        .catch(err => console.error(err))
}