const nailServiceUrl = process.env.EXPO_PUBLIC_API_URL;

export const fetchNailServices = () => {
    return fetch(nailServiceUrl + "nailservices")
        .then(response => {
            if (!response.ok)
                throw new Error("Something went wrong: " + response.statusText);

            return response.json();
        })
        .catch(err => {
            console.error("Error fetching nail services:", err);
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
            console.error("Error fetching nail service:", err);
            throw err;
        });
}


export const saveNailService = (nailservice) => {
    return fetch(nailServiceUrl + 'nailservices', {
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


export const updateNailservice = (nailservice, id) => {
    return fetch(nailServiceUrl + 'nailservices/' + id, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(nailservice)
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
        .then(data => {
            console.log("Updated nailservice data:", data);
            return data;
        })
        .catch(err => console.error(err));
};




export const deleteNailService = (id) => {
    return fetch(nailServiceUrl + "nailservices/" + id, {
        method: 'DELETE'
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
        .catch(err => console.error(err))
}