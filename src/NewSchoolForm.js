import React, { useState, useEffect } from 'react';
import { fetchDistricts, submitNewSchool } from './ApiService';
import { InputField, Button } from '@dhis2/ui';
import styles from './NewSchoolForm.module.css';

const NewSchoolForm = ({ onCancel }) => {
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [schoolName, setSchoolName] = useState('');
    const [location, setLocation] = useState('');
    const [activities, setActivities] = useState('');
    const [geoCoordinates, setGeoCoordinates] = useState('');
    const [picture, setPicture] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDistricts = async () => {
            try {
                const districtResponse = await fetchDistricts();
                setDistricts(districtResponse.organisationUnits); 
            } catch (err) {
                setError(`Failed to fetch districts: ${err.message}`);
            }
        };
        loadDistricts();
    }, []);

    const handleDistrictChange = async (e) => {
        setSelectedDistrict(e.target.value);
        try {
            setShowForm(true); 
        } catch (err) {
            setError(`Failed to fetch schools: ${err.message}`);
        }
    };

    const handleSubmit = async () => {
        const newSchoolData = {
            schoolName,
            location,
            activities,
            geoCoordinates,
            picture,
        };

        try {
            await submitNewSchool(newSchoolData);
            alert("New school recorded successfully!");
            setShowForm(false); 
            onCancel();
        } catch (err) {
            setError(`Failed to submit new school: ${err.message}`);
        }
    };

    const handleGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setGeoCoordinates(`${position.coords.latitude}, ${position.coords.longitude}`);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handlePictureChange = (e) => {
        setPicture(e.target.files[0]);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Record New School</h1>
            <label htmlFor="districtSelect" className={styles.label}>Select District:</label>
            <select 
                id="districtSelect" 
                value={selectedDistrict} 
                onChange={handleDistrictChange}
                className={styles.select}
            >
                <option value="">-- Select a District --</option>
                {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                        {district.displayName}
                    </option>
                ))}
            </select>
            {showForm && (
                <>
                    <InputField
                        label="School Name"
                        value={schoolName}
                        onChange={({ value }) => setSchoolName(value)}
                        className={styles.fieldGroup}
                    />
                    <InputField
                        label="Location"
                        value={location}
                        onChange={({ value }) => setLocation(value)}
                        className={styles.fieldGroup}
                    />
                    <InputField
                        label="Activities"
                        value={activities}
                        onChange={({ value }) => setActivities(value)}
                        className={styles.fieldGroup}
                    />
                    <Button onClick={handleGeoLocation} className={styles.geoButton}>Capture Geo-coordinates</Button>
                    <p>{geoCoordinates}</p>
                    <InputField
                        label="Picture"
                        type="file"
                        onChange={handlePictureChange}
                        className={styles.fieldGroup}
                    />
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <Button onClick={handleSubmit} className={styles.submitButton}>Submit</Button>
                    <Button onClick={onCancel} className={styles.cancelButton}>Cancel</Button>
                </>
            )}
        </div>
    );
};

export default NewSchoolForm;