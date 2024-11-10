import React, { useState } from 'react';
import SchoolInspectionForm from './SchoolInspectionForm';
import Login from './Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const handleLoginSuccess = (school) => {
    setIsAuthenticated(true);
    setSelectedSchool(school);
  };

  const handleCancel = () => {
    setIsAuthenticated(false);
    setSelectedSchool(null);
  };

  return (
    <div className="App">
      {isAuthenticated && selectedSchool ? (
        <SchoolInspectionForm school={selectedSchool} onCancel={handleCancel} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
