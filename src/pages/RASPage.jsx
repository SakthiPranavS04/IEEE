import React, { useState, useEffect } from 'react';
import { rasData } from '../data/ras';
import SocietyPageLayout from '../components/SocietyPageLayout';

const RASPage = () => {
  const [data, setData] = useState(rasData);

  useEffect(() => {
    const stored = localStorage.getItem('ieee_society_data_ras_v4');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing ras data:", e);
      }
    }
  }, []);

  return <SocietyPageLayout data={data} />;
};

export default RASPage;
