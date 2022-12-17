import React from 'react';
import { Tooltip } from 'react-tooltip';
import { FieldSelectorOptions, OnboardingStepItem } from '../../../../types/fields';

type SelectorOptions = FieldSelectorOptions['selector'] | '';

type FormProps = {
  onSubmit: (value: OnboardingStepItem) => void;
  requiredFields: Record<FieldSelectorOptions['selector'], string[]>;
  data?: OnboardingStepItem;
  visible: boolean;
};

export default function FieldForm({ onSubmit, requiredFields, data, visible }: FormProps) {
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

  React.useEffect(() => {
    if (data) {
      setValue(data);
    }
  }, [data]);

  return (
    <div>
      {/*Tooltips that will always have rendered anchor points can be put here, otherwise the tooltip should be rendered with the element it is anchored to. */}
      <Tooltip anchorId="field-selector" place="right" />
      <Tooltip anchorId="field-label" place="right" />
      <Tooltip anchorId="field-field" place="right" />
      <Tooltip anchorId="field-bucket" place="right" />
      <Tooltip anchorId="field-helper-text" place="right" />

      <form
        onSubmit={handleSubmit}
        className="field-form"
        style={{ visibility: visible ? 'visible' : 'hidden' }}
      >
        <label htmlFor="field-selector">
          Selector Type:
          <select
            id="field-selector"
            data-tooltip-content="The selector type the field is coded as"
            value={value.selector}
            required
            onChange={(e) => {
              if (
                !value.selector ||
                window.confirm(
                  'Changing the selector may clear values not shared between selector types. Continue?'
                )
              )
                handleSelector(e.target.value as SelectorOptions);
            }}
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
            data-tooltip-content="The name of the field that the user sees"
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
            data-tooltip-content="The name of the field in the database"
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
            data-tooltip-content="The table the field is stored in the database"
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
            data-tooltip-content="The instruction text shown to the user"
            value={value.helperText}
            onChange={(e) => setValue({ ...value, helperText: e.target.value })}
          />
        </label>
        {(value.selector === 'text' || value.selector === 'textArea') && (
          <form className="field-form">
            <Tooltip anchorId="field-default-value" place="right" />
            <label htmlFor="field-default-value">
              Default value:
              <input
                type="text"
                id="field-default-value"
                data-tooltip-content="The default value of the field"
                value={value.defaultValue as string}
                onChange={(e) => setValue({ ...value, defaultValue: e.target.value })}
              />
            </label>
            <Tooltip anchorId="field-hint" place="right" />
            <label htmlFor="field-hint">
              Hint:
              <input
                type="text"
                id="field-hint"
                data-tooltip-content="A hint to be displayed with the field, usually represented as a grey value in the input (only valid on some field types)"
                value={value.hint}
                onChange={(e) => setValue({ ...value, hint: e.target.value })}
              />
            </label>
            <Tooltip anchorId="field-max-chars" place="right" />
            <label htmlFor="field-max-chars">
              Maximum characters:
              <input
                type="number"
                id="field-max-chars"
                data-tooltip-content="The maximum number of characters allowed for text inputs (only valid on some field types)"
                value={value.maxChars}
                onChange={(e) => setValue({ ...value, maxChars: parseInt(e.target.value) })}
              />
            </label>
            <Tooltip anchorId="field-show-char-counter" place="right" />
            <label htmlFor="field-show-char-counter" className="checkbox">
              <input
                type="checkbox"
                id="field-show-char-counter"
                data-tooltip-content="Indicates whether to display a character counter for text inputs (only valid on some field types)"
                checked={value.showCharCounter}
                onChange={(e) => setValue({ ...value, showCharCounter: e.target.checked })}
              />
              Show character counter
            </label>
          </form>
        )}
        {value.selector === 'number' && (
          <form className="field-form">
            <Tooltip anchorId="field-default-value" place="right" />
            <label htmlFor="field-default-value">
              Default value:
              <input
                type="number"
                id="field-default-value"
                data-tooltip-content="The default value of the field"
                value={value.defaultValue as number}
                onChange={(e) => setValue({ ...value, defaultValue: parseInt(e.target.value) })}
              />
            </label>
            <Tooltip anchorId="field-hint" place="right" />
            <label htmlFor="field-hint">
              Hint:
              <input
                type="text"
                id="field-hint"
                data-tooltip-content="A hint to be displayed with the field, usually represented as a grey value in the input (only valid on some field types)"
                value={value.hint}
                onChange={(e) => setValue({ ...value, hint: e.target.value })}
              />
            </label>
          </form>
        )}
        {value.selector === 'slider' && (
          <form className="field-form">
            <Tooltip anchorId="field-default-value" place="right" />
            <label htmlFor="field-default-value">
              Default value:
              <input
                type="number"
                id="field-default-value"
                data-tooltip-content="The default value of the field"
                value={value.defaultValue as number}
                onChange={(e) => setValue({ ...value, defaultValue: parseInt(e.target.value) })}
              />
            </label>
          </form>
        )}
        {value.selector === 'rangeSlider' && (
          <form className="field-form">
            <Tooltip anchorId="field-default-value-1" place="right" />
            <label htmlFor="field-default-value-1">
              Default value 1:
              <input
                type="number"
                id="field-default-value-1"
                data-tooltip-content="The default value of the field (first value)"
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
            <Tooltip anchorId="field-default-value-2" place="right" />
            <label htmlFor="field-default-value-2">
              Default value 2:
              <input
                type="number"
                id="field-default-value-2"
                data-tooltip-content="The default value of the field (second value)"
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
            <Tooltip anchorId="field-min-number" place="right" />
            <label htmlFor="field-min-number">
              Min Number:
              <input
                type="number"
                id="field-min-number"
                data-tooltip-content="The minimum value allowed for numeric inputs (only applicable to numeric field types)"
                value={value.minNum as number}
                max={value.maxNum}
                onChange={(e) => setValue({ ...value, minNum: parseInt(e.target.value) })}
              />
            </label>
            <Tooltip anchorId="field-max-number" place="right" />
            <label htmlFor="field-max-number">
              Max Number:
              <input
                type="number"
                id="field-max-number"
                data-tooltip-content="The maximum value allowed for numeric inputs (only applicable to numeric field types)"
                value={value.maxNum as number}
                min={value.minNum}
                onChange={(e) => setValue({ ...value, maxNum: parseInt(e.target.value) })}
              />
            </label>
          </form>
        )}
        {value.selector === 'date' && (
          <form className="field-form">
            <label htmlFor="field-default-value">LMAO NOPE NOT YET</label>
          </form>
        )}
        {value.selector === 'switch' && (
          <form className="field-form">
            <Tooltip anchorId="field-default-value" place="right" />
            <label htmlFor="field-default-value" className="checkbox">
              <input
                type="checkbox"
                id="field-default-value"
                data-tooltip-content="The default value of the field"
                checked={value.defaultValue}
                onChange={(e) => setValue({ ...value, defaultValue: e.target.checked })}
              />
              Default Value
            </label>
          </form>
        )}
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
