const fs = require('fs');

// Patch api.js
let apiContent = fs.readFileSync('d:\\IEEE\\public-website\\src\\services\\api.js', 'utf8');
if (!apiContent.includes('formSubmissionService')) {
  const newService = `export const formSubmissionService = {
  create: (data) => fetchWrapper(\`\${API}/formsubmissions\`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
};

`;
  apiContent = apiContent.replace('export const settingsService = {', newService + 'export const settingsService = {');
  fs.writeFileSync('d:\\IEEE\\public-website\\src\\services\\api.js', apiContent);
}

// Patch RequestFormsListing.jsx
let listingContent = fs.readFileSync('d:\\IEEE\\public-website\\src\\pages\\RequestFormsListing.jsx', 'utf8');
listingContent = listingContent.replace(
  "import React, { useState, useEffect } from 'react';",
  "import React, { useState, useEffect } from 'react';\nimport API from '../services/api';"
);

const oldUseEffectListing = `  useEffect(() => {
    // Load request forms from localStorage
    const loadForms = () => {
      setLoading(true);
      const stored = localStorage.getItem('ieee_request_forms');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setForms(parsed);
        } catch (e) {
          console.error("Error reading request forms", e);
        }
      }
      // Add a slight delay to show premium shimmer skeletons
      setTimeout(() => {
        setLoading(false);
      }, 600);
    };

    loadForms();
  }, []);`;

const newUseEffectListing = `  const [globalPinEnabled, setGlobalPinEnabled] = useState(true);
  const [globalAccessPin, setGlobalAccessPin] = useState('1234');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [formsData, settingsData] = await Promise.all([
          API.formTemplateService.getAll(),
          API.settingsService.getAll()
        ]);
        setForms(formsData);
        
        const getVal = (key) => {
          const s = settingsData.find(s => s.key === key);
          return s ? s.value : null;
        };
        const pinEnabled = getVal('ieee_pin_enabled');
        if (pinEnabled !== null) setGlobalPinEnabled(pinEnabled !== 'false');
        const pin = getVal('ieee_access_pin');
        if (pin) setGlobalAccessPin(pin);
      } catch (e) { console.error(e); }
      setTimeout(() => setLoading(false), 600);
    };
    loadData();
  }, []);`;

listingContent = listingContent.replace(oldUseEffectListing, newUseEffectListing);
listingContent = listingContent.replace(/localStorage\.getItem\('ieee_pin_enabled'\)\s*!==\s*'false'/g, 'globalPinEnabled');
listingContent = listingContent.replace(/localStorage\.getItem\('ieee_access_pin'\)\s*\|\|\s*'1234'/g, 'globalAccessPin');
fs.writeFileSync('d:\\IEEE\\public-website\\src\\pages\\RequestFormsListing.jsx', listingContent);

// Patch RequestFormPage.jsx
let formPageContent = fs.readFileSync('d:\\IEEE\\public-website\\src\\pages\\RequestFormPage.jsx', 'utf8');

const oldUseEffectPage = `  useEffect(() => {
    const loadForm = () => {
      setLoading(true);
      try {
        const stored = localStorage.getItem('ieee_request_forms');
        if (stored) {
          const forms = JSON.parse(stored);
          const found = forms.find(f => f.route_slug === id);
          if (found) {
            setFormConfig(found);
          } else {
            setError('Form not found.');
          }
        } else {
          setError('No forms available.');
        }
      } catch (e) {
        setError('Error loading form configuration.');
      }
      setTimeout(() => setLoading(false), 800);
    };
    loadForm();
  }, [id]);`;

const newUseEffectPage = `  const [globalPinEnabled, setGlobalPinEnabled] = useState(true);
  const [globalAccessPin, setGlobalAccessPin] = useState('1234');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [formsData, settingsData] = await Promise.all([
          API.formTemplateService.getAll(),
          API.settingsService.getAll()
        ]);
        const found = formsData.find(f => f.route_slug === id);
        if (found) setFormConfig(found);
        else setError('Form not found.');
        
        const getVal = (key) => {
          const s = settingsData.find(s => s.key === key);
          return s ? s.value : null;
        };
        const pinEnabled = getVal('ieee_pin_enabled');
        if (pinEnabled !== null) setGlobalPinEnabled(pinEnabled !== 'false');
        const pin = getVal('ieee_access_pin');
        if (pin) setGlobalAccessPin(pin);
      } catch (e) {
        setError('Error loading form data.');
      }
      setTimeout(() => setLoading(false), 800);
    };
    loadData();
  }, [id]);`;

formPageContent = formPageContent.replace(oldUseEffectPage, newUseEffectPage);
formPageContent = formPageContent.replace(/localStorage\.getItem\('ieee_pin_enabled'\)\s*!==\s*'false'/g, 'globalPinEnabled');
formPageContent = formPageContent.replace(/localStorage\.getItem\('ieee_access_pin'\)\s*\|\|\s*'1234'/g, 'globalAccessPin');

// Replace localStorage submission logic
const oldSubmitBlock = `      setTimeout(() => {
        const newSubmission = {
          id: 'sub_' + Date.now(),
          form_id: formConfig.id,
          form_name: formConfig.form_name,
          submitter_name: 'System User', 
          date: new Date().toISOString(),
          status: 'pending',
          payload: payload
        };
        const existing = JSON.parse(localStorage.getItem('ieee_form_submissions') || '[]');
        localStorage.setItem('ieee_form_submissions', JSON.stringify([newSubmission, ...existing]));

        setIsSubmitting(false);
        setSubmitSuccess(true);
      }, 1500);`;

const newSubmitBlock = `      setTimeout(async () => {
        try {
          const newSubmission = {
            form_id: formConfig.id,
            form_name: formConfig.form_name,
            submitter_name: payload.name || payload.applicantName || 'System User', 
            payload: payload
          };
          await API.formSubmissionService.create(newSubmission);
          setSubmitSuccess(true);
        } catch (e) {
          console.error(e);
          alert('Failed to submit form.');
        } finally {
          setIsSubmitting(false);
        }
      }, 1500);`;

formPageContent = formPageContent.replace(oldSubmitBlock, newSubmitBlock);
fs.writeFileSync('d:\\IEEE\\public-website\\src\\pages\\RequestFormPage.jsx', formPageContent);

console.log('Successfully patched request forms');
