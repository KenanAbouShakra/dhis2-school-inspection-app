import React, { useState } from 'react';
import { InputField, Radio, Button } from '@dhis2/ui';
import styles from './SchoolInspectionForm.module.css';

const BASE_URL = 'https://research.im.dhis2.org/in5320g19';

const SchoolInspectionForm = ({ school, onCancel }) => {
  const [reportDate, setReportDate] = useState('');
  const [computerLab, setComputerLab] = useState('');
  const [computerLabCondition, setComputerLabCondition] = useState('');
  const [electricitySupply, setElectricitySupply] = useState('');
  const [electricityCondition, setElectricityCondition] = useState('');
  const [handwashing, setHandwashing] = useState('');
  const [handwashingCondition, setHandwashingCondition] = useState('');
  const [library, setLibrary] = useState('');
  const [libraryCondition, setLibraryCondition] = useState('');
  const [totalClassrooms, setTotalClassrooms] = useState('');
  const [cleanClassrooms, setCleanClassrooms] = useState('');
  const [playground, setPlayground] = useState('');
  const [playgroundCondition, setPlaygroundCondition] = useState('');
  const [teacherToilets, setTeacherToilets] = useState('');
  const [qualifiedTeachersPRI, setQualifiedTeachersPRI] = useState('');
  const [totalStudents, setTotalStudents] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle number inputs and prevent negative values
  const handleNumberChange = (setter) => (value) => {
    const numericValue = parseInt(value, 10);
    if (numericValue < 0) {
      setErrors(prev => ({ ...prev, [setter.name]: "Value cannot be negative" }));
    } else {
      setErrors(prev => ({ ...prev, [setter.name]: "" }));
      setter(numericValue);
    }
  };

  // Submit the inspection form data to the API
  const submitEvent = async () => {
    const eventPayload = {
      events: [
        {
          program: "UxK2o06ScIe",          
          programStage: "eJiBjm9Rl7E",     
          orgUnit: school.orgUnitId,         
          eventDate: reportDate,
          status: "COMPLETED",
          dataValues: [
            { dataElement: "Nvp4hIbXrzF", value: computerLab },              
            { dataElement: "gzhjCMe7OyS", value: computerLabCondition },     
            { dataElement: "IKiSAA19Xvl", value: electricitySupply },        
            { dataElement: "MH2eDd7qWxR", value: electricityCondition },     
            { dataElement: "n9KwS4rY2HC", value: handwashing },              
            { dataElement: "ie3bFiVatHT", value: handwashingCondition },    
            { dataElement: "Y6DQqwTdhiZ", value: library },               
            { dataElement: "IAomDvMcUDr", value: libraryCondition },         
            { dataElement: "ya5SyA5hej4", value: totalClassrooms },          
            { dataElement: "XIgpDhDC4Ol", value: cleanClassrooms },          
            { dataElement: "XThfmg6f2oC", value: playground },               
            { dataElement: "JzZfwXtdL6G", value: playgroundCondition },      
            { dataElement: "I13NTyLrHBm", value: teacherToilets },  
            { dataElement: "RJi5MW86kCs", value: qualifiedTeachersPRI },
            { dataElement: "ue3QIMOAC7G", value: totalStudents },         
          ],
        },
      ],
    };

    try {
      const response = await fetch(`${BASE_URL}/api/tracker/events`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('in5320:P1@tform'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      });      

      if (response.ok) {
        alert("Event submitted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error submitting event:", errorData);
        alert("Failed to submit event. See console for details.");
      }
    } catch (error) {
      const errorData = await error.response?.json();
      console.error("Error details:", errorData || error.message);
      alert("Failed to submit event. See console for details.");
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!reportDate) newErrors.reportDate = "Report date is required";
    if (computerLab === '' || computerLab === undefined) newErrors.computerLab = "Please select if there is a computer lab";
    if (computerLab === 'Yes' && !computerLabCondition) newErrors.computerLabCondition = "Condition is required when there is a computer lab";
    if (electricitySupply === '' || electricitySupply === undefined) newErrors.electricitySupply = "Please select if there is an electricity supply";
    if (electricitySupply === 'Yes' && !electricityCondition) newErrors.electricityCondition = "Condition is required when there is electricity supply";
    if (handwashing === '' || handwashing === undefined) newErrors.handwashing = "Please select if there are handwashing facilities";
    if (handwashing === 'Yes' && !handwashingCondition) newErrors.handwashingCondition = "Condition is required when there are handwashing facilities";
    if (library === '' || library === undefined) newErrors.library = "Please select if there is a library";
    if (library === 'Yes' && !libraryCondition) newErrors.libraryCondition = "Condition is required when there is a library";
    if (!totalClassrooms) newErrors.totalClassrooms = "Total classrooms are required";
    if (!cleanClassrooms) newErrors.cleanClassrooms = "Clean classrooms are required";
    if (parseInt(cleanClassrooms, 10) > parseInt(totalClassrooms, 10)) {
      newErrors.cleanClassrooms = "Clean classrooms cannot exceed total classrooms";
    }
    if (playground === '' || playground === undefined) newErrors.playground = "Please select if there is a yard/playground";
    if (playground === 'Yes' && !playgroundCondition) newErrors.playgroundCondition = "Condition is required when there is a playground";
    if (!teacherToilets) newErrors.teacherToilets = "Toilets for teachers are required";
    if (!qualifiedTeachersPRI) newErrors.qualifiedTeachersPRI = "Qualified teachers are required";
    if (!totalStudents) newErrors.totalStudents = "Total number of students is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; 
    }

    const confirmationMessage = `
      Report Date: ${reportDate}
      Computer Lab: ${computerLab} (Condition: ${computerLabCondition})
      Electricity Supply: ${electricitySupply} (Condition: ${electricityCondition})
      Handwashing Facilities: ${handwashing} (Condition: ${handwashingCondition})
      Library: ${library} (Condition: ${libraryCondition})
      Total Classrooms: ${totalClassrooms}
      Clean Classrooms: ${cleanClassrooms}
      Playground: ${playground} (Condition: ${playgroundCondition})
      Toilets for Teachers: ${teacherToilets}
      Qualified Teachers PRI: ${qualifiedTeachersPRI}
      Total Students: ${totalStudents}
    `;

    if (window.confirm(`Are you sure you want to submit the following information?\n\n${confirmationMessage}`)) {
      console.log({
        reportDate,
        computerLab,
        computerLabCondition,
        electricitySupply,
        electricityCondition,
        handwashing,
        handwashingCondition,
        library,
        libraryCondition,
        totalClassrooms,
        cleanClassrooms,
        playground,
        playgroundCondition,
        teacherToilets,
        qualifiedTeachersPRI,
        totalStudents,
      });

      const formData = {
        reportDate,
        computerLab,
        computerLabCondition,
        electricitySupply,
        electricityCondition,
        handwashing,
        handwashingCondition,
        library,
        libraryCondition,
        totalClassrooms,
        cleanClassrooms,
        playground,
        playgroundCondition,
        teacherToilets,
        qualifiedTeachersPRI,
        totalStudents,
      };

      const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inspection_form_${school ? school.name : 'School'}.json`;
      link.click();

      submitEvent();

      setSubmitted(true);
      onCancel();
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>School Inspection Form for {school ? school.name : 'School'}</h1>

      <InputField
        label="Report Date"
        type="date"
        value={reportDate}
        onChange={({ value }) => setReportDate(value)}
        className={styles.fieldGroup}
      />
      {errors.reportDate && <p className={styles.errorMessage}>{errors.reportDate}</p>}

      <div className={styles.fieldGroup}>
        <label className={styles.inputLabel}>The school has a computer lab for learners</label>
        <div className={styles.radioGroup}>
          <Radio label="Yes" value="Yes" checked={computerLab === 'Yes'} onChange={() => {
            setComputerLab('Yes');
          }} />
          <Radio label="No" value="No" checked={computerLab === 'No'} onChange={() => {
            setComputerLab('No');
            setComputerLabCondition('');
          }} />
        </div>
      </div>
      {errors.computerLab && <p className={styles.errorMessage}>{errors.computerLab}</p>}

      {computerLab === 'Yes' && (
        <InputField
          label="The computer lab is in good condition"
          type="number"
          value={computerLabCondition}
          onChange={({ value }) => handleNumberChange(setComputerLabCondition)(value)}
          className={styles.fieldGroup}
        />
      )}
      {errors.computerLabCondition && <p className={styles.errorMessage}>{errors.computerLabCondition}</p>}

      <div className={styles.fieldGroup}>
        <label className={styles.inputLabel}>The school has an electricity supply</label>
        <div className={styles.radioGroup}>
          <Radio label="Yes" value="Yes" checked={electricitySupply === 'Yes'} onChange={() => {
            setElectricitySupply('Yes');
          }} />
          <Radio label="No" value="No" checked={electricitySupply === 'No'} onChange={() => {
            setElectricitySupply('No');
            setElectricityCondition('');
          }} />
        </div>
      </div>
      {errors.electricitySupply && <p className={styles.errorMessage}>{errors.electricitySupply}</p>}

      {electricitySupply === 'Yes' && (
        <InputField
          label="The electricity supply is in good condition"
          type="number"
          value={electricityCondition}
          onChange={({ value }) => handleNumberChange(setElectricityCondition)(value)}
          className={styles.fieldGroup}
        />
      )}
      {errors.electricityCondition && <p className={styles.errorMessage}>{errors.electricityCondition}</p>}

      <div className={styles.fieldGroup}>
        <label className={styles.inputLabel}>The school has handwashing facilities</label>
        <div className={styles.radioGroup}>
          <Radio label="Yes" value="Yes" checked={handwashing === 'Yes'} onChange={() => {
            setHandwashing('Yes');
          }} />
          <Radio label="No" value="No" checked={handwashing === 'No'} onChange={() => {
            setHandwashing('No');
            setHandwashingCondition('');
          }} />
        </div>
      </div>
      {errors.handwashing && <p className={styles.errorMessage}>{errors.handwashing}</p>}

      {handwashing === 'Yes' && (
        <InputField
          label="The handwashing facilities are in good condition"
          type="number"
          value={handwashingCondition}
          onChange={({ value }) => handleNumberChange(setHandwashingCondition)(value)}
          className={styles.fieldGroup}
        />
      )}
      {errors.handwashingCondition && <p className={styles.errorMessage}>{errors.handwashingCondition}</p>}

      <div className={styles.fieldGroup}>
        <label className={styles.inputLabel}>There is a school library</label>
        <div className={styles.radioGroup}>
          <Radio label="Yes" value="Yes" checked={library === 'Yes'} onChange={() => {
            setLibrary('Yes');
          }} />
          <Radio label="No" value="No" checked={library === 'No'} onChange={() => {
            setLibrary('No');
            setLibraryCondition('');
          }} />
        </div>
      </div>
      {errors.library && <p className={styles.errorMessage}>{errors.library}</p>}

      {library === 'Yes' && (
        <InputField
          label="The school library is in good condition"
          type="text"
          value={libraryCondition}
          onChange={({ value }) => setLibraryCondition(value)}
          className={styles.fieldGroup}
        />
      )}
      {errors.libraryCondition && <p className={styles.errorMessage}>{errors.libraryCondition}</p>}

      <InputField
        label="Total number of classrooms"
        type="number"
        value={totalClassrooms}
        onChange={({ value }) => handleNumberChange(setTotalClassrooms)(value)}
        className={styles.fieldGroup}
      />
      {errors.totalClassrooms && <p className={styles.errorMessage}>{errors.totalClassrooms}</p>}

      <InputField
        label="Total number of classrooms that are clean and secure"
        type="number"
        value={cleanClassrooms}
        onChange={({ value }) => handleNumberChange(setCleanClassrooms)(value)}
        className={styles.fieldGroup}
      />
      {errors.cleanClassrooms && <p className={styles.errorMessage}>{errors.cleanClassrooms}</p>}

      <div className={styles.fieldGroup}>
        <label className={styles.inputLabel}>The school has a yard/playground</label>
        <div className={styles.radioGroup}>
          <Radio label="Yes" value="Yes" checked={playground === 'Yes'} onChange={() => {
            setPlayground('Yes');
          }} />
          <Radio label="No" value="No" checked={playground === 'No'} onChange={() => {
            setPlayground('No');
            setPlaygroundCondition('');
          }} />
        </div>
      </div>
      {errors.playground && <p className={styles.errorMessage}>{errors.playground}</p>}

      {playground === 'Yes' && (
        <InputField
          label="The yard/playground is kept clean, tidy and safe"
          type="text"
          value={playgroundCondition}
          onChange={({ value }) => setPlaygroundCondition(value)}
          className={styles.fieldGroup}
        />
      )}
      {errors.playgroundCondition && <p className={styles.errorMessage}>{errors.playgroundCondition}</p>}

      <InputField
        label="Toilets for teachers"
        type="number"
        value={teacherToilets}
        onChange={({ value }) => handleNumberChange(setTeacherToilets)(value)}
        className={styles.fieldGroup}
      />
      {errors.teacherToilets && <p className={styles.errorMessage}>{errors.teacherToilets}</p>}

      <InputField
        label="Qualified Teachers PRI"
        type="number"
        value={qualifiedTeachersPRI}
        onChange={({ value }) => handleNumberChange(setQualifiedTeachersPRI)(value)}
        className={styles.fieldGroup}
      />
      {errors.qualifiedTeachersPRI && <p className={styles.errorMessage}>{errors.qualifiedTeachersPRI}</p>}

      <InputField
        label="Total number of students"
        type="number"
        value={totalStudents}
        onChange={({ value }) => handleNumberChange(setTotalStudents)(value)}
        className={styles.fieldGroup}
      />
      {errors.totalStudents && <p className={styles.errorMessage}>{errors.totalStudents}</p>}


      <Button onClick={handleSubmit} className={styles.submitButton}>Submit</Button>
      <Button onClick={onCancel} className={styles.cancelButton}>Cancel</Button>

      {submitted && <p className={styles.successMessage}>Form submitted successfully!</p>}
    </div>
  );
};

export default SchoolInspectionForm;
