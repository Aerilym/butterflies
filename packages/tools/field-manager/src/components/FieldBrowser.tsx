import React from 'react';
import { OnboardingStepItem } from '../../../../types/fields';

type FormProps = {
  fields: OnboardingStepItem[];
};

interface GenericField {
  label: string;
  field: string;
  bucket: string;
  selector: string;
  helperText: string;
  defaultValue?: string | number | boolean;
  hint?: string;
  minNum?: number;
  maxNum?: number;
  maxChars?: number;
  showCharCounter?: boolean;
  options?: string[];
}

//const fieldNA = <span className="na-icon">N/A</span>;
const fieldNA = <span className="na-icon"></span>;

export default function FieldBrowser({ fields }: FormProps) {
  const genericFields = fields as GenericField[];
  return (
    <div className="field-browser">
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>Field</th>
            <th>Bucket</th>
            <th>Selector</th>
            <th>Helper Text</th>
            <th>Default Value</th>
            <th>Hint*</th>
            <th>Min Num*</th>
            <th>Max Num*</th>
            <th>Max Chars*</th>
            <th>Show Char Count*</th>
            <th>Options*</th>
          </tr>
        </thead>
        <tbody>
          {genericFields.map((field) => (
            <tr key={`${field.bucket}-${field.field}`}>
              <td>{field.label}</td>
              <td>{field.field}</td>
              <td>{field.bucket}</td>
              <td>{field.selector}</td>
              <td>{field.helperText}</td>
              <td>{field.defaultValue?.toString()}</td>
              <td>{field.hint ?? fieldNA}</td>
              <td>{field.minNum?.toString() ?? fieldNA}</td>
              <td>{field.maxNum?.toString() ?? fieldNA}</td>
              <td>{field.maxChars?.toString() ?? fieldNA}</td>
              <td>{field.showCharCounter?.toString() ?? fieldNA}</td>
              <td>{field.options?.join(', ') ?? fieldNA}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
