import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './Form.css';

import FieldForm from './components/FieldForm';
import { OnboardingStepItem } from './types';
import FieldBrowser from './components/FieldBrowser';

const generalRequiredFields = ['label', 'field', 'bucket', 'selector'];

const requiredFields = {
  text: [...generalRequiredFields],
  textArea: [...generalRequiredFields],
  slider: [...generalRequiredFields],
  rangeSlider: [...generalRequiredFields],
  date: [...generalRequiredFields],
  number: [...generalRequiredFields],
  switch: [...generalRequiredFields],
  dropdown: [...generalRequiredFields, 'options'],
  radio: [...generalRequiredFields, 'options'],
  checkboxes: [...generalRequiredFields, 'options'],
};

function App() {
  const [fields, setFields] = useState<OnboardingStepItem[]>([] as OnboardingStepItem[]);
  function handleFormSubmit(value: OnboardingStepItem) {
    fetch('https://field-manager.aerilym.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),
    });
  }

  useEffect(() => {
    fetch('https://field-manager.aerilym.workers.dev/').then(async (response) =>
      setFields(await response.json())
    );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <FieldBrowser fields={fields} />
        <FieldForm onSubmit={handleFormSubmit} requiredFields={requiredFields} />
      </header>
    </div>
  );
}

export default App;
