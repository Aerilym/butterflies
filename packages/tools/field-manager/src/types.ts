export interface FieldSelectorData {
  label: string;
  helperText?: string;
}

export type FieldSelectorOptions =
  | {
      selector: 'text';
      defaultValue?: string;
      hint?: string;
      maxChars?: number;
      showCharCounter?: boolean;
    }
  | {
      selector: 'textArea';
      defaultValue?: string;
      hint?: string;
      maxChars?: number;
      showCharCounter?: boolean;
    }
  | {
      selector: 'slider';
      defaultValue?: number;
      minNum?: number;
      maxNum?: number;
    }
  | {
      selector: 'rangeSlider';
      defaultValue?: number[];
      minNum?: number;
      maxNum?: number;
    }
  | {
      selector: 'date';
      defaultValue?: Date;
    }
  | {
      selector: 'number';
      defaultValue?: number;
      hint?: number | string;
      minNum?: number;
      maxNum?: number;
    }
  | {
      selector: 'switch';
      defaultValue?: boolean;
    }
  | {
      selector: 'dropdown' | 'radio';
      options: string[];
      defaultValue?: string;
    }
  | {
      selector: 'checkboxes';
      options: string[];
      defaultValue?: string[];
    };

export type OnboardingStepItem = {
  bucket: string;
  field: string;
} & FieldSelectorOptions &
  FieldSelectorData;
