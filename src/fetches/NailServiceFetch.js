const nailServiceUrl = process.env.EXPO_PUBLIC_API_URL;

export const fetchNailServices = () => {
    return fetch(nailServiceUrl + "nailservices")
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

export const fetchSpecificNailService = (id) => {
    return fetch(nailServiceUrl + "nailservices/" + id)
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


export const saveNailService = (nailservice) => {
    return fetch(nailServiceUrl + '/nailservices', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(nailservice)
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Addition failed: " + response.statusText);

            return response.json();
        })
        .catch(err => console.error(err))
}

export const updateNailservice = (nailservice, link) => {
    return fetch(link, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(nailservice)
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



export const deleteNailService = (url) => {
    return fetch(url, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Error in delete: " + response.statusText);
        })
        .catch(err => console.error(err))
}