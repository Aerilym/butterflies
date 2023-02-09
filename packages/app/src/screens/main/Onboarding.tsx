import { useEffect, useState } from 'react';
import { Box, Button, Text, Heading, Progress, Badge } from 'native-base';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';
import type { CompletePageData } from '../../../../types/api';
import { FieldSelector } from '../../components/profile/FieldSelector';
import { supabaseAPI, userStore } from '../../provider/AuthProvider';
import { OnboardingStepItem } from '../../../../types/fields';
import Loading from '../utility/Loading';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Onboarding'>) {
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [onboardingOrder, setOnboardingOrder] = useState<string[]>([]);
  const [completePage, setCompletePage] = useState<CompletePageData>({} as CompletePageData);
  const [fields, setFields] = useState<OnboardingStepItem[]>([] as OnboardingStepItem[]);

  useEffect(() => {
    fetch('https://field-manager.butterfliesapp.workers.dev/options?key=onboardingOrder').then(
      async (response) => {
        const { value } = await response.json();
        setOnboardingOrder(value);
      }
    );
    fetch('https://field-manager.butterfliesapp.workers.dev/options?key=completePage').then(
      async (response) => {
        const { value } = await response.json();
        setCompletePage(value);
      }
    );
  }, []);

  useEffect(() => {
    if (onboardingOrder.length === 0) return;
    fetch('https://field-manager.butterfliesapp.workers.dev/').then(async (response) => {
      const value: OnboardingStepItem[] = await response.json();
      const newFields = value
        .filter((item) => onboardingOrder.includes(item.field))
        .sort((a, b) => onboardingOrder.indexOf(a.field) - onboardingOrder.indexOf(b.field));

      setFields(newFields);
    });
  }, [onboardingOrder]);

  if (fields.length === 0) return <Loading />;

  const renderCurrentItem = () => {
    if (stepNumber >= fields.length) return renderCompleteItem();
    const item = fields[stepNumber];
    return <FieldSelector key={item.field} {...item} />;
  };

  const renderNextButton = (disabled?: boolean) => {
    const label =
      stepNumber === fields.length
        ? completePage?.buttonLabel ?? 'Complete Onboarding'
        : 'Continue';

    return (
      <Button
        style={{ marginVertical: 10, borderRadius: 50 }}
        onPress={async () => {
          if (stepNumber === fields.length) {
            await userStore.storeProfile();
            await userStore.storePreferences();
            await supabaseAPI.onboard({
              profile: userStore.profile,
              preferences: userStore.preferences,
            });
            await supabaseAPI.completeOnboarding();
            await userStore.refreshProfile();
            await supabaseAPI.supabase.auth.refreshSession();
          } else {
            setStepNumber(stepNumber + 1);
          }
        }}
        disabled={disabled}
      >
        <Text style={{ color: 'white', marginHorizontal: 40 }}>{label}</Text>
      </Button>
    );
  };

  const renderBackButton = (disabled?: boolean) => {
    if (stepNumber === 0) return null;

    return (
      <Button
        style={{ marginVertical: 10, borderRadius: 50 }}
        onPress={() => {
          setStepNumber(stepNumber - 1);
        }}
        disabled={disabled}
      >
        <Text style={{ color: 'white', marginHorizontal: 40 }}>{'Back'}</Text>
      </Button>
    );
  };

  const renderCompleteItem = () => {
    return (
      <Box style={{ flex: 1, alignItems: 'center', marginTop: 100 }}>
        <Heading size="xl" style={{ marginVertical: 20 }}>
          {completePage?.heading ?? 'Onboarding Complete!'}
        </Heading>
        <Text style={{ marginVertical: 20 }}>{completePage?.subheading ?? ''}</Text>
        <Box
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Text style={{ alignSelf: 'center' }}>
            {completePage?.description ?? 'You can now start swiping!'}
          </Text>
        </Box>
      </Box>
    );
  };

  return (
    <Box style={{ flex: 1, justifyContent: 'space-between' }}>
      <Box style={{ justifyContent: 'flex-start' }}>
        <Box style={{ marginVertical: 10, marginHorizontal: '20%' }}>
          <Box
            style={{
              position: 'absolute',
              justifyContent: 'space-between',
              flexDirection: 'row',
              width: '100%',
              zIndex: 1,
            }}
          >
            {fields.length > 0
              ? fields.map((step, index) => {
                  return (
                    <Button
                      key={index}
                      accessibilityLabel={step.label}
                      onPress={() => {
                        setStepNumber(index);
                      }}
                      style={{
                        width: 30,
                        height: 30,
                        paddingTop: 0,
                        paddingBottom: 0,
                        paddingLeft: 0,
                        paddingRight: 0,
                        top: -5,
                        borderRadius: 50,
                      }}
                      variant={index <= stepNumber ? 'solid' : 'outline'}
                      bg={index <= stepNumber ? 'primary.500' : 'gray.200'}
                    >
                      {index + 1}
                    </Button>
                  );
                })
              : null}
          </Box>
          <Progress
            value={stepNumber}
            min={0}
            max={fields.length - 1}
            size="xl"
            bg="gray.200"
            _filledTrack={{
              bg: 'primary.400',
            }}
          ></Progress>
        </Box>
        <Badge
          rounded={'full'}
          style={{
            marginVertical: 20,
            alignSelf: 'center',
            width: 50,
          }}
        >
          {Math.round((stepNumber / fields.length) * 100) + '%'}
        </Badge>
        <Box
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'absolute',
            alignSelf: 'center',
            width: '100%',
            marginTop: 40,
            zIndex: -1,
          }}
        >
          {renderCurrentItem()}
        </Box>
      </Box>
      <Box
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          marginVertical: 40,
          marginHorizontal: 40,
        }}
      >
        {renderBackButton()}
        {renderNextButton()}
      </Box>
    </Box>
  );
}
