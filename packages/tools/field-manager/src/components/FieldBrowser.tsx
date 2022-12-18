import { Tooltip } from 'react-tooltip';
import { OnboardingStepItem } from '../../../../types/fields';

type FormProps = {
  fields: OnboardingStepItem[];
  handleEdit: (value: OnboardingStepItem) => void;
  handleDelete: (key: string) => void;
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

export default function FieldBrowser({ fields, handleEdit, handleDelete }: FormProps) {
  const genericFields = fields as GenericField[];
  return (
    <div className="field-browser">
      <Tooltip anchorId="label-header" />
      <Tooltip anchorId="field-header" />
      <Tooltip anchorId="bucket-header" />
      <Tooltip anchorId="selector-header" />
      <Tooltip anchorId="helper-text-header" />
      <Tooltip anchorId="default-value-header" />
      <Tooltip anchorId="hint-header" />
      <Tooltip anchorId="min-num-header" />
      <Tooltip anchorId="max-num-header" />
      <Tooltip anchorId="max-chars-header" />
      <Tooltip anchorId="show-char-count-header" />
      <Tooltip anchorId="options-header" />

      <h3>Field Browser</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th id="label-header" data-tooltip-content="The name of the field that the user sees">
              Label
            </th>
            <th id="field-header" data-tooltip-content="The name of the field in the database">
              Field
            </th>
            <th
              id="bucket-header"
              data-tooltip-content="The table the field is stored in the database"
            >
              Bucket
            </th>
            <th id="selector-header" data-tooltip-content="The selector type the field is coded as">
              Selector
            </th>
            <th
              id="helper-text-header"
              data-tooltip-content="The instruction text shown to the user"
            >
              Helper Text
            </th>
            <th id="default-value-header" data-tooltip-content="The default value of the field">
              Default Value
            </th>
            <th
              id="hint-header"
              data-tooltip-content="A hint to be displayed with the field, usually represented as a grey value in the input (only valid on some field types)"
            >
              Hint*
            </th>
            <th
              id="min-num-header"
              data-tooltip-content="The minimum value allowed for numeric inputs (only applicable to numeric field types)"
            >
              Min Num*
            </th>
            <th
              id="max-num-header"
              data-tooltip-content="The maximum value allowed for numeric inputs (only applicable to numeric field types)"
            >
              Max Num*
            </th>
            <th
              id="max-chars-header"
              data-tooltip-content="The maximum number of characters allowed for text inputs (only valid on some field types)"
            >
              Max Chars*
            </th>
            <th
              id="show-char-count-header"
              data-tooltip-content="Indicates whether to display a character counter for text inputs (only valid on some field types)"
            >
              Show Char Count*
            </th>
            <th
              id="options-header"
              data-tooltip-content="The selectable options for a field (only valid on some field types)"
            >
              Options*
            </th>
          </tr>
        </thead>
        <tbody>
          {genericFields.map((field) => (
            <tr key={`${field.bucket}-${field.field}`}>
              <td className="button-group">
                <button
                  className="edit"
                  onClick={() => {
                    handleEdit(field as OnboardingStepItem);
                  }}
                >
                  edit
                </button>
                <button
                  className="delete"
                  onClick={() => {
                    if (
                      window.confirm(
                        'Are you sure you wish to delete the item ' + field.field + '?'
                      )
                    )
                      handleDelete(field.field);
                  }}
                >
                  x
                </button>
              </td>
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
