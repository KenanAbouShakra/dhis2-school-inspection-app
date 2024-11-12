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
    const [showInspector, setShowInspector] = useState(false);

    // Fetch districts when component loads
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

    // Handle click to show Inspector view
    const handleInspectorClick = () => {
        setShowInspector(true);
        setShowPlanner(false);
    };

    // Handle click to show Planner view
    const handlePlannerClick = () => {
        setShowPlanner(true);
        setShowInspector(false);
    };

    // Handle district change and fetch school data
    const handleDistrictChange = async (e) => {
        setSelectedDistrict(e.target.value);
        if (!e.target.value) {
            setSchoolData(null);
            return;
        }

        try {
            const schoolResponse = await fetchSchoolsInCluster(e.target.value);
            setSchoolData(schoolResponse.children);
            setError(null);
        } catch (err) {
            setError(`Failed to fetch schools: ${err.message}`);
            console.error("Error details: ", err);
        }
    };

    // Handle selecting a school to view details
    const handleSelectSchool = (school) => {
        const hasInspectionProgram = school.programs.some(
            (program) => program.id === "UxK2o06ScIe" 
        );
        if (hasInspectionProgram) {
            onLoginSuccess(school);
        } else {
            alert("This school does not have the School Inspection program.");
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>DHIS2 School Data</h1>

            <div className={styles.cardContainer}>
                {/* Inspector Card */}
                <div className={styles.card}>
                    <h2>Inspector</h2>
                    <button onClick={handleInspectorClick} className={styles.button}>
                        Inspector Form
                    </button>
                </div>

                {/* Planning Card */}
                <div className={styles.card}>
                    <h2>Planning</h2>
                    <button onClick={handlePlannerClick} className={styles.button}>
                        Plan Visit
                    </button>
                </div>
            </div>

            {/* Display Inspector view if selected */}
            {showInspector && (
                <div className={styles.section}>
                    <h2>Inspector View</h2>
                    <div className={styles.selectContainer}>
                        <label htmlFor="districtSelect" className={styles.label}>Select District:</label>
                        <select 
                            id="districtSelect" 
                            className={styles.select}
                            value={selectedDistrict} 
                            onChange={handleDistrictChange}
                        >
                            <option value="">-- Select a District --</option>
                            {districts.map((district) => (
                                <option key={district.id} value={district.id}>
                                    {district.displayName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Display list of schools */}
                    {schoolData && (
                        <ul className={styles.schoolList}>
                            {schoolData.map((school, index) => (
                                <li key={index} className={styles.schoolCard}>
                                    <h3 className={styles.schoolName}>{school.name}</h3>
                                    <button onClick={() => handleSelectSchool(school)}>
                                        View School Inspection Form
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Display Planner view if selected */}
            {showPlanner && (
                <div className={styles.section}>
                    <h2>Plan Inspection</h2>
                    <Planner 
                        onCancel={() => setShowPlanner(false)} 
                        onPlanConfirmed={() => setShowPlanner(false)}
                        districts={districts}
                    />
                </div>
            )}

            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
}

export default Login;
