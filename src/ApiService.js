export const BASE_URL = "https://research.im.dhis2.org/in5320g19";

// GET Request: get districts
export const fetchDistricts = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/organisationUnits?page=1&fields=displayName,id`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Basic " + btoa("in5320:P1@tform"),
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch districts: " + response.statusText);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching districts from DHIS2 API:", error);
        throw error;
    }
};

// GET Request: Get schools in a district
export const fetchSchoolsInCluster = async (districtId) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/organisationUnits/${districtId}?fields=name,children[name,id,geometry,dataSets[name,id],programs[name,id]]`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Basic " + btoa("in5320:P1@tform"),
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch schools in cluster: " + response.statusText);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching data from DHIS2 API:", error);
        throw error;
    }
};

// POST Request: Send event
export const submitEvent = async (eventPayload) => {
    try {
        const response = await fetch(`${BASE_URL}/api/tracker/events`, {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa("in5320:P1@tform"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(eventPayload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error submitting event:", errorData);
            throw new Error("Failed to submit event: " + errorData.message);
        }

        return await response.json();
    } catch (error) {
        console.error("Error submitting event:", error);
        throw error;
    }
};
export const submitNewSchool = async (schoolData) => {
    try {
        const response = await fetch(`${BASE_URL}/api/newSchools`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa('in5320:P1@tform'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(schoolData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error submitting new school:", errorData);
            throw new Error("Failed to submit new school: " + errorData.message);
        }

        return await response.json();
    } catch (error) {
        console.error("Error submitting new school:", error);
        throw error;
    }
};