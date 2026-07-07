import React, { useState, useEffect } from 'react';
import { comsocData } from '../data/comsoc';
import SocietyPageLayout from '../components/SocietyPageLayout';
import { settingsService } from '../services/api';

const ComSocPage = () => {
  const [data, setData] = useState(comsocData);

  useEffect(() => {
    const stored = localStorage.getItem('ieee_society_data_comsoc_v5');
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing comsoc data:", e);
      }
    }
  }, []);

  return <SocietyPageLayout data={data} />;
};

export default ComSocPage;
// Exporting under both names in case ComSoc is referred in different bindings
export { ComSocPage as ComsocPage };
