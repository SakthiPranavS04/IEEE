import React, { useState, useEffect } from 'react';
import { wieData } from '../data/wie';
import SocietyPageLayout from '../components/SocietyPageLayout';

const WIEPage = () => {
  const [data, setData] = useState(wieData);

  useEffect(() => {
    const stored = localStorage.getItem('ieee_society_data_wie_v4');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing wie data:", e);
      }
    }
  }, []);

  return <SocietyPageLayout data={data} />;
};

export default WIEPage;
