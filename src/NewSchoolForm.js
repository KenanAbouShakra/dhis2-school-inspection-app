import React, { useState } from 'react';
import { submitNewSchool } from './ApiService';
import { InputField, Button } from '@dhis2/ui';
import styles from './NewSchoolForm.module.css';

const NewSchoolForm = ({ onCancel }) => {
    const [schoolName, setSchoolName] = useState('');
    const [location, setLocation] = useState('');
    const [activities, setActivities] = useState('');
    const [geoCoordinates, setGeoCoordinates] = useState('');
    const [picture, setPicture] = useState(null);
    const [error, setError] = useState(null);

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
        <div className={styles.formContainer}>
            <h1 className={styles.title}>Record New School</h1>
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
        </div>
    );
};

export default NewSchoolForm;