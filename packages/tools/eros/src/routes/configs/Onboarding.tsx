import { useEffect, useState } from 'react';

import { OnboardingStepItem } from '../../../../../types/fields';
import { CompletePageData } from '../../../../../types/api';

import Header from '../../components/Header';
import OnboardingOrder from '../../components/config/onboarding/OnboardingOrder';
import CompletePage from '../../components/config/onboarding/CompletePage';

import '../../styles/config/onboarding/Form.css';
import '../../styles/config/onboarding/OnboardingOrder.css';
import Loading from '../../components/Loading';

export default function Onboarding() {
  const [fields, setFields] = useState<OnboardingStepItem[]>([] as OnboardingStepItem[]);
  const [loading, setLoading] = useState(true);

  async function updateCompletePage(value: CompletePageData) {
    setLoading(true);
    const res = await fetch('https://field-manager.aerilym.workers.dev/options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: 'completePage',
        value,
      }),
    });

    if (res.status !== 200 && res.status !== 201) {
      alert('Something went wrong saving the field: ' + res.statusText);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetch('https://field-manager.aerilym.workers.dev/').then(async (response) => {
      setFields(await response.json());
      setLoading(false);
    });
  }, []);

  return (
    <div className="container">
      <Header title="Onboarding Config" description="Onboarding config" />
      <div className="content">
        {loading ? <Loading /> : null}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <OnboardingOrder fields={fields} />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <CompletePage onSubmit={updateCompletePage} visible={true} />
        </div>
      </div>
    </div>
  );
}
