import React, { useState } from 'react';
import SchoolInspectionForm from './SchoolInspectionForm';
import Login from './Login';
import NewSchoolForm from './NewSchoolForm';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [showNewSchoolForm, setShowNewSchoolForm] = useState(false);

    const handleLoginSuccess = (school) => {
        setIsAuthenticated(true);
        setSelectedSchool(school);
    };

    const handleCancel = () => {
        setIsAuthenticated(false);
        setSelectedSchool(null);
        setShowNewSchoolForm(false);
    };

    return (
        <div className="App">
            {isAuthenticated && selectedSchool ? (
                <SchoolInspectionForm school={selectedSchool} onCancel={handleCancel} />
            ) : showNewSchoolForm ? (
                <NewSchoolForm onCancel={handleCancel} />
            ) : (
                <Login onLoginSuccess={handleLoginSuccess} onNewSchool={() => setShowNewSchoolForm(true)} />
            )}
            
        </div>
    );
}

export default App;