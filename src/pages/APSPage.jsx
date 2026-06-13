import React, { useState, useEffect } from 'react';
import { apsData } from '../data/aps';
import SocietyPageLayout from '../components/SocietyPageLayout';

const APSPage = () => {
  const [data, setData] = useState(apsData);

  useEffect(() => {
    const stored = localStorage.getItem('ieee_society_data_ap-s');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing aps data:", e);
      }
    }
  }, []);

  return <SocietyPageLayout data={data} />;
};

export default APSPage;
