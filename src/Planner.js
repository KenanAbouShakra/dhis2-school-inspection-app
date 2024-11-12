import React, { useState } from "react";
import { fetchSchoolsInCluster } from "./ApiService";
import styles from './Planner.module.css';

function Planner({ onCancel, onPlanConfirmed, districts }) { 
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [schoolData, setSchoolData] = useState([]);
    const [selectedSchools, setSelectedSchools] = useState([]);
    const [inspectionDate, setInspectionDate] = useState('');
    const [error, setError] = useState(null);

    const handleDistrictChange = async (e) => {
        setSelectedDistrict(e.target.value);
        setSelectedSchools([]);
        try {
            const schools = await fetchSchoolsInCluster(e.target.value);
            setSchoolData(schools.children);
        } catch (err) {
            setError(`Failed to fetch schools: ${err.message}`);
        }
    };

    const handleSchoolSelection = (school) => {
        if (selectedSchools.includes(school)) {
            setSelectedSchools(selectedSchools.filter(s => s !== school));
        } else if (selectedSchools.length < 2) {
            setSelectedSchools([...selectedSchools, school]);
        } else {
            alert("You can only select up to two schools.");
        }
    };

    const handlePlanSubmit = () => {
        if (!inspectionDate || selectedSchools.length !== 2) {
            alert("Please select exactly two schools and a date.");
            return;
        }

        const planData = {
            date: inspectionDate,
            schools: selectedSchools.map(school => school.name),
        };

        console.log("Inspection Plan:", planData);

        if (window.confirm(`Confirm inspection plan for ${selectedSchools.map(s => s.name).join(' and ')} on ${inspectionDate}?`)) {
            const blob = new Blob([JSON.stringify(planData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `inspection_plan_${inspectionDate}.json`;
            link.click();

            setSelectedDistrict('');
            setSelectedSchools([]);
            setInspectionDate('');
            setSchoolData([]);
            onPlanConfirmed();
        }
    };

    return (
        <div className={styles.container}>
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

            {schoolData.length > 0 && (
                <>
                    <label htmlFor="inspectionDate" className={styles.label}>Select Date:</label>
                    <input 
                        type="date" 
                        id="inspectionDate" 
                        value={inspectionDate} 
                        onChange={(e) => setInspectionDate(e.target.value)}
                        className={styles.dateInput}
                    />

                    <h3>Select Schools (Max 2):</h3>
                    <ul className={styles.schoolList}>
                        {schoolData.map((school) => (
                            <li key={school.id} className={styles.schoolCard}>
                                <label>
                                    <input
                                        type="checkbox"
                                        onChange={() => handleSchoolSelection(school)}
                                        checked={selectedSchools.includes(school)}
                                    />
                                    {school.name}
                                </label>
                            </li>
                        ))}
                    </ul>

                    <button onClick={handlePlanSubmit} className={styles.submitButton}>
                        Confirm Inspection Plan
                    </button>

                    <button onClick={onCancel} className={styles.cancelButton}>
                        Cancel
                    </button>
                </>
            )}

            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
}

export default Planner;
