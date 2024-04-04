
const reservationUrl = process.env.EXPO_PUBLIC_API_URL;

export const fetchReservations = () => {
    return fetch(reservationUrl + "reservations")
        .then(response => {
            if (!response.ok)
                throw new Error("Something went wrong: " + response.statusText);

            return response.json();
        })
        .catch(err => {
            console.error("Error fetching reservations:", err);
            throw err;
        });
}


export const fetchSpecificReservation = (id) => {
    return fetch(reservationUrl + "reservations/" + id)
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

export const fetchReservationsOfDay = (date) => {
    return fetch(reservationUrl + "reservations/byday/" + date) // Date format at endpoint is yyyy-mm-dd
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch reservation of day " + date + ": " + response.statusText);
            }
            return response.json();
        })
        .catch(err => {
            throw new Error("Failed to fetch reservation: " + err.message);
        });
}



export const saveReservation = (reservation) => {
    return fetch(reservationUrl + 'reservations', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(reservation)
    })
        .then(response => {
            if (response.status === 201) {
                return { success: true };
            } else if (!response.ok) {
                throw new Error("Addition failed: " + response.statusText);
            } else {
                throw new Error("Unexpected response: " + response.status);
            }
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
}

export const updateReservation = (reservation, id) => {
    return fetch(reservationUrl + "reservations/" + id, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(reservation)
    })
        .then(response => {
            if (response.status === 200) {
                return { success: true };
            } else if (!response.ok) {
                throw new Error("Error in edit: " + response.statusText);
            } else {
                throw new Error("Unexpected response: " + response.status);
            }
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
};


export const deleteReservation = (reservationId) => {
    return fetch(reservationUrl + "reservations/" + reservationId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.status === 204) {
                return { success: true };
            } else if (!response.ok) {
                throw new Error("Error in delete: " + response.statusText);
            } else {
                throw new Error("Unexpected response: " + response.status);
            }
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
};
