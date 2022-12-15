interface CloudflarePayload {
  env?: Env;
  ctx?: ExecutionContext;
}

interface FetchPayload extends CloudflarePayload {
  request: Request;
}

interface ScheduledPayload extends CloudflarePayload {
  controller: ScheduledController;
}

interface FieldSelectorData {
  label: string;
  helperText?: string;
}

type FieldSelectorOptions =
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

type OnboardingStepItem = {
  bucket: string;
  field: string;
} & FieldSelectorOptions &
  FieldSelectorData;
