import React, { useEffect, useState } from 'react';

import { OnboardingStepItem } from '../../../../../types/fields';

import Header from '../../components/Header';
import FieldForm from '../../components/config/users/FieldForm';

import '../../styles/config/onboarding/Form.css';
import Loading from '../../components/Loading';
import Table, { RowWarning, TableData } from '../../components/Table';
import { supabaseAdminClient } from '../../supabase';

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

export default function UserFields() {
  const [fields, setFields] = useState<OnboardingStepItem[]>([] as OnboardingStepItem[]);
  const [data, setData] = useState<OnboardingStepItem>({} as OnboardingStepItem);
  const [profileCols, setProfileCols] = useState<string[]>([]);
  const [preferenceCols, setPreferenceCols] = useState<string[]>([]);
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

  const columns = [];

  for (const key in fields[0]) {
    columns.push({ Header: key, accessor: key });
  }

  const fieldData = fields.map((field) => {
    const row: TableData = {};

    for (const key in field) {
      row[key] = field[key as keyof OnboardingStepItem] as string;
    }

    return row;
  });

  const warningRows: RowWarning[] = fields.map((field) => {
    const warning: RowWarning = {
      severity: 'none',
      message: `${field.field} not found in ${field.bucket} table`,
    };
    if (field.bucket === 'profile') {
      warning.severity = profileCols.includes(field.field) ? 'none' : 'low';
    } else if (field.bucket === 'preferences') {
      warning.severity = preferenceCols.includes(field.field) ? 'none' : 'low';
    }
    return warning;
  });

  const warnings = {
    rowWarnings: {
      rows: warningRows,
      attachedColumn: 'field',
    },
  };

  useEffect(() => {
    fetch('https://field-manager.aerilym.workers.dev/').then(async (response) => {
      setFields(await response.json());
      setLoading(false);
    });
    supabaseAdminClient
      .from('profiles')
      .select('*')
      .limit(1)
      .then(({ data, error }) => {
        if (error) throw error;
        if (!data) return;

        const cols = [];

        for (const key in data[0]) {
          cols.push(key);
        }
        setProfileCols(cols);
      });
    supabaseAdminClient
      .from('preferences')
      .select('*')
      .limit(1)
      .then(({ data, error }) => {
        if (error) throw error;
        if (!data) return;

        const cols = [];

        for (const key in data[0]) {
          cols.push(key);
        }
        setPreferenceCols(cols);
      });
  }, []);

  return (
    <div className="container">
      <Header title="User Config" description="User config" />
      {loading ? <Loading /> : null}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Table columns={columns} data={fieldData} warnings={warnings} />
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      ></div>
    </div>
  );
}
