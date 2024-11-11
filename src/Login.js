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
    const [showDistrictSelect, setShowDistrictSelect] = useState(false);

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

    const handleInspectorClick = () => {
        setShowDistrictSelect(true);
        setShowInspector(true);
        setShowPlanner(false); // Hide Planner
        setSchoolData(null); // Clear previous school data when switching views
    };

    const handlePlannerClick = () => {
        setShowDistrictSelect(true);
        setShowPlanner(true);
        setShowInspector(false); // Hide Inspector
        setSchoolData(null); // Clear previous school data when switching views
    };

    const handleDistrictSelect = async () => {
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

    const handleCancel = () => {
        setShowPlanner(false);
    };

    const handlePlanConfirmed = () => {
        setShowPlanner(false);
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

            {/* Show district select after a function is chosen */}
            {showDistrictSelect && (
                <div className={styles.selectContainer}>
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
                    <button onClick={handleDistrictSelect} className={styles.fetchButton}>
                        Fetch Schools
                    </button>
                </div>
            )}

            {/* Display Inspector view if selected */}
            {showInspector && (
                <div className={styles.section}>
                    <h2>Inspector View</h2>
                    {schoolData ? (
                        <ul className={styles.schoolList}>
                            {schoolData.children.map((school, index) => (
                                <li key={index} className={styles.schoolCard}>
                                    <h3 className={styles.schoolName}>{school.name}</h3>
                                    <button onClick={() => handleSelectSchool(school)}>
                                        View School Inspection Form
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Select a district and click "Fetch Schools" to see schools.</p>
                    )}
                </div>
            )}

            {/* Display Planner view if selected */}
            {showPlanner && (
                <div className={styles.section}>
                    <h2>Plan Inspection</h2>
                    <Planner onCancel={handleCancel} onPlanConfirmed={handlePlanConfirmed} />
                </div>
            )}

            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
}

export default Login;
