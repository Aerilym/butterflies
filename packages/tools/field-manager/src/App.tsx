import React, { useEffect, useState } from 'react';
import './App.css';
import './Form.css';

import FieldForm from './components/FieldForm';
import { OnboardingStepItem } from '../../../types/fields';
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
  const [data, setData] = useState<OnboardingStepItem>({} as OnboardingStepItem);
  const [showForm, setShowForm] = useState(false);

  async function handleFormSubmit(value: OnboardingStepItem) {
    const res = await fetch('https://field-manager.aerilym.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),
    });

    if (res.status === 200 || res.status === 201) {
      setFields([...fields, value]);
    } else {
      alert('Something went wrong saving the field: ' + res.statusText);
    }
  }

  function handleEdit(value: OnboardingStepItem) {
    setData(value);
    setShowForm(true);
  }

  async function handleDelete(key: string) {
    const res = await fetch('https://field-manager.aerilym.workers.dev/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key }),
    });

    if (res.status === 200) {
      setFields(fields.filter((field) => field.field !== key));
    } else {
      alert('Something went wrong deleting the field: ' + res.statusText);
    }
  }

  useEffect(() => {
    fetch('https://field-manager.aerilym.workers.dev/').then(async (response) =>
      setFields(await response.json())
    );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <FieldBrowser fields={fields} handleEdit={handleEdit} handleDelete={handleDelete} />

        {showForm ? (
          <button
            className="cancel-field"
            onClick={() => {
              setShowForm(!showForm);
            }}
          >
            Cancel
          </button>
        ) : (
          <button
            className="create-field"
            onClick={() => {
              setShowForm(!showForm);
            }}
          >
            Create New Field
          </button>
        )}
        <FieldForm
          onSubmit={handleFormSubmit}
          requiredFields={requiredFields}
          data={data}
          visible={showForm}
        />
      </header>
    </div>
  );
}

export default App;
