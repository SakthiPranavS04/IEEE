import React, { useState, useEffect } from 'react';
import { computerSocietyData } from '../data/computerSociety';
import SocietyPageLayout from '../components/SocietyPageLayout';
import { settingsService } from '../services/api';

const ComputerSocietyPage = () => {
  const [data, setData] = useState(computerSocietyData);

  useEffect(() => {
    const stored = localStorage.getItem('ieee_society_data_computer-society_v5');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing computer-society data:", e);
      }
    }
  }, []);

  return <SocietyPageLayout data={data} />;
};

export default ComputerSocietyPage;
