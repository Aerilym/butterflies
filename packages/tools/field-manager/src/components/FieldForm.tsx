import React from 'react';
import { FieldSelectorOptions, OnboardingStepItem } from '../../../../types/fields';

type SelectorOptions = FieldSelectorOptions['selector'] | '';

type FormProps = {
  onSubmit: (value: OnboardingStepItem) => void;
  requiredFields: Record<FieldSelectorOptions['selector'], string[]>;
};

export default function FieldForm({ onSubmit, requiredFields }: FormProps) {
  const [value, setValue] = React.useState({} as Partial<OnboardingStepItem>);

  const fieldOptions = [
    '',
    'text',
    'textArea',
    'slider',
    'rangeSlider',
    'date',
    'number',
    'switch',
    'dropdown',
    'radio',
    'checkboxes',
  ].sort();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.selector) return;
    const required = requiredFields[value.selector];
    const missing = required.filter((field) => !value[field as keyof OnboardingStepItem]);
    if (missing.length > 0) {
      alert(`Missing required fields: ${missing.join(', ')}`);
      return;
    }
    onSubmit(value as OnboardingStepItem);
  }

  function handleSelector(selector: SelectorOptions) {
    if (selector === '') return;
    setValue({ selector });
  }

  return (
    <form onSubmit={handleSubmit} className="field-form">
      <label htmlFor="field-selector">
        Selector Type:
        <select
          id="field-selector"
          value={value.selector}
          required
          onChange={(e) => handleSelector(e.target.value as SelectorOptions)}
        >
          {fieldOptions.map((option) => (
            <option
              key={option}
              value={option}
              disabled={['date', 'dropdown', 'checkboxes', 'radio'].includes(option)}
            >
              {option}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="field-label">
        Field label:
        <input
          type="text"
          id="field-label"
          required
          value={value.label}
          onChange={(e) => setValue({ ...value, label: e.target.value })}
        />
      </label>
      <label htmlFor="field-field">
        Field field name:
        <input
          type="text"
          id="field-field"
          required
          value={value.field}
          pattern="^[a-z]*$"
          onChange={(e) => setValue({ ...value, field: e.target.value })}
        />
      </label>
      <label htmlFor="field-bucket">
        Field bucket:
        <input
          type="text"
          id="field-bucket"
          required
          value={value.bucket}
          pattern="^[a-z]*$"
          onChange={(e) => setValue({ ...value, bucket: e.target.value })}
        />
      </label>
      <label htmlFor="field-helper-text">
        Helper text:
        <input
          type="text"
          id="field-helper-text"
          value={value.helperText}
          onChange={(e) => setValue({ ...value, helperText: e.target.value })}
        />
      </label>
      {(value.selector === 'text' || value.selector === 'textArea') && (
        <form className="field-form">
          <label htmlFor="default-value">
            Default value:
            <input
              type="text"
              id="default-value"
              value={value.defaultValue as string}
              onChange={(e) => setValue({ ...value, defaultValue: e.target.value })}
            />
          </label>
          <label htmlFor="hint">
            Hint:
            <input
              type="text"
              id="hint"
              value={value.hint}
              onChange={(e) => setValue({ ...value, hint: e.target.value })}
            />
          </label>
          <label htmlFor="max-chars">
            Maximum characters:
            <input
              type="number"
              id="max-chars"
              value={value.maxChars}
              onChange={(e) => setValue({ ...value, maxChars: parseInt(e.target.value) })}
            />
          </label>
          <label htmlFor="show-char-counter" className="checkbox">
            <input
              type="checkbox"
              id="show-char-counter"
              checked={value.showCharCounter}
              onChange={(e) => setValue({ ...value, showCharCounter: e.target.checked })}
            />
            Show character counter
          </label>
        </form>
      )}
      {value.selector === 'number' && (
        <form className="field-form">
          <label htmlFor="default-value">
            Default value:
            <input
              type="number"
              id="default-value"
              value={value.defaultValue as number}
              onChange={(e) => setValue({ ...value, defaultValue: parseInt(e.target.value) })}
            />
          </label>
          <label htmlFor="hint">
            Hint:
            <input
              type="text"
              id="hint"
              value={value.hint}
              onChange={(e) => setValue({ ...value, hint: e.target.value })}
            />
          </label>
        </form>
      )}
      {value.selector === 'slider' && (
        <form className="field-form">
          <label htmlFor="default-value">
            Default value:
            <input
              type="number"
              id="default-value"
              value={value.defaultValue as number}
              onChange={(e) => setValue({ ...value, defaultValue: parseInt(e.target.value) })}
            />
          </label>
        </form>
      )}
      {value.selector === 'rangeSlider' && (
        <form className="field-form">
          <label htmlFor="default-value-1">
            Default value 1:
            <input
              type="number"
              id="default-value-1"
              value={value.defaultValue && value.defaultValue[0] ? value.defaultValue[0] : 0}
              onChange={(e) =>
                setValue({
                  ...value,
                  defaultValue: [
                    parseInt(e.target.value),
                    value.defaultValue && value.defaultValue[1] ? value.defaultValue[1] : 0,
                  ],
                })
              }
            />
          </label>
          <label htmlFor="default-value-2">
            Default value 2:
            <input
              type="number"
              id="default-value-2"
              value={value.defaultValue && value.defaultValue[1] ? value.defaultValue[1] : 0}
              onChange={(e) =>
                setValue({
                  ...value,
                  defaultValue: [
                    value.defaultValue && value.defaultValue[0] ? value.defaultValue[0] : 0,
                    parseInt(e.target.value),
                  ],
                })
              }
            />
          </label>
        </form>
      )}
      {(value.selector === 'slider' ||
        value.selector === 'rangeSlider' ||
        value.selector === 'number') && (
        <form className="field-form">
          <label htmlFor="min-number">
            Min Number:
            <input
              type="number"
              id="min-number"
              value={value.minNum as number}
              max={value.maxNum}
              onChange={(e) => setValue({ ...value, minNum: parseInt(e.target.value) })}
            />
          </label>
          <label htmlFor="max-number">
            Max Number:
            <input
              type="number"
              id="max-number"
              value={value.maxNum as number}
              min={value.minNum}
              onChange={(e) => setValue({ ...value, maxNum: parseInt(e.target.value) })}
            />
          </label>
        </form>
      )}
      {value.selector === 'date' && (
        <form className="field-form">
          <label htmlFor="default-value">LMAO NOPE NOT YET</label>
        </form>
      )}
      {value.selector === 'switch' && (
        <form className="field-form">
          <label htmlFor="default-value" className="checkbox">
            <input
              type="checkbox"
              id="default-value"
              checked={value.defaultValue}
              onChange={(e) => setValue({ ...value, defaultValue: e.target.checked })}
            />
            Default Value
          </label>
        </form>
      )}
      <input type="submit" value="Submit" />
    </form>
  );
}
