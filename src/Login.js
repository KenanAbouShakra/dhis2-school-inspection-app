import React, { useState, useEffect } from "react";
import { fetchDistricts, fetchSchoolsInCluster } from "./ApiService";
import Planner from "./Planner";
import styles from './Login.module.css';

function Login({ onLoginSuccess }) { 
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [schoolData, setSchoolData] = useState(null);
    const [error, setError] = useState(null);
    const [showPlanner, setShowPlanner] = useState(false);

    // Fetch districts when the component mounts
    useEffect(() => {
        const loadDistricts = async () => {
            try {
                const districtResponse = await fetchDistricts();
                setDistricts(districtResponse.organisationUnits); 
                setError(null);
            } catch (err) {
                setError(`Failed to fetch districts: ${err.message}`);
                console.error("Error details: ", err);
            }
        };

        loadDistricts();
    }, []);

    // Fetch schools in the selected district
    const handleLogin = async () => {
        if (!selectedDistrict) {
            alert("Please select a district.");
            return;
        }

        try {
            const schoolResponse = await fetchSchoolsInCluster(selectedDistrict);
            setSchoolData(schoolResponse);
            setError(null);
        } catch (err) {
            setError(`Failed to fetch data: ${err.message}`);
            console.error("Error details: ", err);
        }
    };

    // Select a school and check if it has the inspection program
    const handleSelectSchool = (school) => {
        const hasInspectionProgram = school.programs.some(
            (program) => program.id === "UxK2o06ScIe" 
        );
        if (hasInspectionProgram) {
            onLoginSuccess(school); // Pass the selected school with orgUnit as an attribute to the parent component
        } else {
            alert("This school does not have the School Inspection program.");
        }
    };

    // Handle cancel button for planner view
    const handleCancel = () => {
        setShowPlanner(false);
    };

    // Handle confirmation after planning inspection
    const handlePlanConfirmed = () => {
        setShowPlanner(false);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>DHIS2 School Data</h1>

            {/* Dropdown to select a district */}
            <label htmlFor="districtSelect" className={styles.label}>Select District:</label>
            <select 
                id="districtSelect" 
                className={styles.select}
                value={selectedDistrict} 
                onChange={(e) => setSelectedDistrict(e.target.value)}
            >
                <option value="">-- Select a District --</option>
                {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                        {district.displayName}
                    </option>
                ))}
            </select>

            <button onClick={handleLogin} className={styles.fetchButton}>
                Fetch Schools Data
            </button>
            <button onClick={() => setShowPlanner(true)} className={styles.planButton}>
                Plan Inspection
            </button>
            
            {/* Display planner if `showPlanner` is true */}
            {showPlanner && (
                <Planner onCancel={handleCancel} onPlanConfirmed={handlePlanConfirmed} />
            )}

            {/* Display list of schools if data is fetched */}
            {schoolData && (
                <div>
                    <h2 className={styles.title}>Schools in {schoolData.name}</h2>
                    <ul className={styles.schoolList}>
                        {schoolData.children.map((school, index) => (
                            <li key={index} className={styles.schoolCard}>
                                <h3 className={styles.schoolName}>{school.name}</h3>
                                <button onClick={() => handleSelectSchool(school)}>
                                    View School Inspection Form
                                </button>
                                
                                {/* Display data sets if available */}
                                {school.dataSets && school.dataSets.length > 0 && (
                                    <div className={styles.dataSets}>
                                        <h4>Data Sets:</h4>
                                        <ul>
                                            {school.dataSets.map((dataSet, dsIndex) => (
                                                <li key={dsIndex}>
                                                    {dataSet.name} <span>(ID: {dataSet.id})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {/* Display programs if available */}
                                {school.programs && school.programs.length > 0 && (
                                    <div className={styles.programs}>
                                        <h4>Programs:</h4>
                                        <ul>
                                            {school.programs.map((program, progIndex) => (
                                                <li key={progIndex}>
                                                    {program.name} <span>(ID: {program.id})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
}

export default Login;
