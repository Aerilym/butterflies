import React, { useEffect, useState } from 'react';

import { OnboardingStepItem } from '../../../../../types/fields';
import { CompletePageData } from '../../../../../types/api';

import Header from '../../components/Header';
import FieldForm from '../../components/config/users/FieldForm';
import FieldBrowser from '../../components/config/users/FieldBrowser';
import OnboardingOrder from '../../components/config/onboarding/OnboardingOrder';
import CompletePage from '../../components/config/onboarding/CompletePage';

import '../../styles/config/onboarding/Form.css';
import '../../styles/config/onboarding/OnboardingOrder.css';
import Loading from '../../components/Loading';

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

export default function Onboarding() {
  const [fields, setFields] = useState<OnboardingStepItem[]>([] as OnboardingStepItem[]);
  const [data, setData] = useState<OnboardingStepItem>({} as OnboardingStepItem);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  async function handleFormSubmit(value: OnboardingStepItem) {
    setLoading(true);
    const res = await fetch('https://field-manager.aerilym.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),
    });

    if (res.status === 200 || res.status === 201) {
      setFields([...fields, value]);
      setShowForm(false);
    } else {
      alert('Something went wrong saving the field: ' + res.statusText);
    }
    setLoading(false);
  }

  function handleEdit(value: OnboardingStepItem) {
    setData(value);
    setShowForm(true);
  }

  async function updateCompletePage(value: CompletePageData) {
    setLoading(true);
    const res = await fetch('https://field-manager.aerilym.workers.dev/options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: 'completePage',
        value,
      }),
    });

    if (res.status !== 200 && res.status !== 201) {
      alert('Something went wrong saving the field: ' + res.statusText);
    }
    setLoading(false);
  }

  async function handleDelete(key: string) {
    setLoading(true);
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
    setLoading(false);
  }

  useEffect(() => {
    fetch('https://field-manager.aerilym.workers.dev/').then(async (response) => {
      setFields(await response.json());
      setLoading(false);
    });
  }, []);

  return (
    <div className="container">
      <Header title="Onboarding Config" description="Onboarding config" />
      <div className="content">
        {loading ? <Loading /> : null}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <OnboardingOrder fields={fields} />
          <FieldBrowser fields={fields} handleEdit={handleEdit} handleDelete={handleDelete} />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <CompletePage onSubmit={updateCompletePage} visible={true} />
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
        </div>
      </div>
    </div>
  );
}
