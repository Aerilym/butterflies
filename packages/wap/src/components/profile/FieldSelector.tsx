import {
  Box,
  Input,
  Text,
  Heading,
  Switch,
  TextArea,
  Slider,
  Select,
  Radio,
  Checkbox,
} from 'native-base';
import { useEffect, useState } from 'react';

import { OnboardingStepItem } from '../../types/auth';
import { userStore } from '../../provider/AuthProvider';

export function FieldSelector(options: OnboardingStepItem) {
  const { selector, bucket, field, label, helperText, defaultValue } = options;

  const [inputValue, setInputValue] = useState<any>(defaultValue);

  const [onChangeValue, setOnChangeValue] = useState<number>(0);

  const submitValue = (): void => {
    bucket === 'profile'
      ? (userStore.profile[field] = inputValue)
      : (userStore.preferences[field] = inputValue);
  };

  const selectorInput = (): JSX.Element => {
    switch (selector) {
      case 'dropdown':
        return (
          <Select
            selectedValue={inputValue}
            minWidth="200"
            accessibilityLabel={label}
            placeholder={options.hint ?? label ?? defaultValue}
            _selectedItem={{
              bg: 'teal.600',
            }}
            mt={1}
            onValueChange={(itemValue: string) => {
              setInputValue(itemValue);
              submitValue();
            }}
          >
            {options.options?.map((option) => (
              <Select.Item key={option} label={option} value={option} />
            ))}
          </Select>
        );

      case 'radio':
        return (
          <Radio.Group
            name={label}
            accessibilityLabel={label}
            value={inputValue}
            size="md"
            onChange={(nextValue) => {
              setInputValue(nextValue);
              submitValue();
            }}
          >
            {options.options?.map((option) => (
              <Radio key={option} value={option} my={1}>
                {option}
              </Radio>
            ))}
          </Radio.Group>
        );

      case 'checkboxes':
        return (
          <Checkbox.Group
            id={label}
            defaultValue={inputValue as string[]}
            accessibilityLabel={label}
            onChange={(values: string[]) => {
              setInputValue(values);
              submitValue();
            }}
          >
            {options.options?.map((option) => (
              <Checkbox key={option} value={option} my={1}>
                {option}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );

      case 'switch':
        return (
          <Switch
            name={label}
            value={inputValue}
            size="lg"
            onToggle={(value: boolean) => {
              setInputValue(value);
              submitValue();
            }}
          />
        );

      case 'number':
        return (
          <Box>
            <Text>lol this selector hasn't been built yet</Text>
          </Box>
        );

      case 'date':
        return (
          <Box>
            <Text>lol this selector hasn't been built yet</Text>
          </Box>
        );

      case 'slider':
        return (
          <Slider
            w="3/4"
            maxW="300"
            accessibilityLabel={label}
            defaultValue={inputValue}
            minValue={options.minNum ?? 0}
            maxValue={options.maxNum ?? 100}
            step={1}
            onChange={(value: number) => {
              setOnChangeValue(value);
            }}
            onChangeEnd={(value: number) => {
              setInputValue(value);
              submitValue();
            }}
          >
            <Slider.Track>
              <Slider.FilledTrack />
            </Slider.Track>
            <Slider.Thumb>
              <Text style={{ position: 'absolute', top: 20, right: 0 }}>{onChangeValue}</Text>
            </Slider.Thumb>
          </Slider>
        );

      case 'rangeSlider':
        return (
          <Box>
            <Text>lol this selector hasn't been built yet</Text>
          </Box>
        );

      case 'textArea':
        return (
          <>
            <TextArea
              w="3/4"
              maxW="300"
              placeholder={options.hint ?? ''}
              defaultValue={inputValue}
              onChangeText={(text: string) => {
                setInputValue(text);
                submitValue();
              }}
              maxLength={options.maxChars ?? 128}
              autoCompleteType="on"
            />
            {options.showCharCounter ? (
              <Text
                fontSize="xs"
                style={{ color: 'gray', position: 'absolute', bottom: 4, right: 64 }}
              >
                {inputValue?.length ?? 0}/{options.maxChars ?? 128}
              </Text>
            ) : null}
          </>
        );

      case 'text':
      default:
        return (
          <>
            <Input
              w="3/4"
              maxW="300"
              placeholder={options.hint ?? ''}
              defaultValue={inputValue}
              onChangeText={(text: string) => {
                setInputValue(text);
                submitValue();
              }}
              maxLength={options.maxChars ?? 32}
            />
            {options.showCharCounter ? (
              <Text
                fontSize="xs"
                style={{ color: 'gray', position: 'absolute', bottom: 4, right: 64 }}
              >
                {inputValue?.length ?? 0}/{options.maxChars ?? 32}
              </Text>
            ) : null}
          </>
        );
    }
  };
  useEffect(() => {
    setInputValue(defaultValue);
  }, []);
  return (
    <Box style={{ flex: 1, alignItems: 'center', marginTop: 100 }}>
      <Heading size="xl" style={{ marginVertical: 20 }}>
        {label}
      </Heading>
      <Text style={{ marginVertical: 20 }}>{helperText}</Text>
      <Box
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {selectorInput()}
      </Box>
    </Box>
  );
}
