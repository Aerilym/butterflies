import { useState } from 'react';
import { Box, Button, Text, Heading, Progress, Badge } from 'native-base';

import { FieldSelector } from '../../components/profile/FieldSelector';
import { supabaseAPI, userStore } from '../../provider/AuthProvider';

import { steps } from './OnboardingSteps';

export default function () {
  const [stepNumber, setStepNumber] = useState<number>(0);

  const renderCurrentItem = () => {
    const item = steps[stepNumber];
    return <FieldSelector key={item.field} {...item} />;
  };

  const renderNextButton = (disabled?: boolean) => {
    const label = stepNumber === steps.length - 1 ? 'Complete Onboarding' : 'Continue';

    return (
      <Button
        style={{ marginVertical: 10, borderRadius: 50 }}
        onPress={async () => {
          if (stepNumber === steps.length - 1) {
            await userStore.storeProfile();
            await userStore.storePreferences();
            await supabaseAPI.completeOnboarding(userStore.profile, userStore.preferences);
            await userStore.refreshProfile();
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

  return (
    <Box style={{ flex: 1, justifyContent: 'space-between' }}>
      <Box style={{ justifyContent: 'flex-start' }}>
        <Heading style={{ marginVertical: 10, alignSelf: 'center' }}>Onboarding</Heading>
        <Box style={{ marginVertical: 10 }}>
          <Box
            style={{
              position: 'absolute',
              justifyContent: 'space-between',
              flexDirection: 'row',
              width: '100%',
              zIndex: 1,
            }}
          >
            {steps.map((step, index) => {
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
            })}
          </Box>
          <Progress
            value={stepNumber}
            min={0}
            max={steps.length - 1}
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
          {Math.round((stepNumber / steps.length) * 100) + '%'}
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
