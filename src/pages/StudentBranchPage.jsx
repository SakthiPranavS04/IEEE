import React, { useState, useEffect } from 'react';
import { studentBranchData } from '../data/studentBranch';
import SocietyPageLayout from '../components/SocietyPageLayout';

const StudentBranchPage = () => {
  const [data, setData] = useState(studentBranchData);

  useEffect(() => {
    const stored = localStorage.getItem('ieee_society_data_student-branch');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing student-branch data:", e);
      }
    }
  }, []);

  return <SocietyPageLayout data={data} />;
};

export default StudentBranchPage;
