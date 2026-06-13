import React, { useState, useEffect } from 'react';
import { pesData } from '../data/pes';
import SocietyPageLayout from '../components/SocietyPageLayout';

const PESPage = () => {
  const [data, setData] = useState(pesData);

  useEffect(() => {
    const stored = localStorage.getItem('ieee_society_data_pes_v4');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing pes data:", e);
      }
    }
  }, []);

  return <SocietyPageLayout data={data} />;
};

export default PESPage;
