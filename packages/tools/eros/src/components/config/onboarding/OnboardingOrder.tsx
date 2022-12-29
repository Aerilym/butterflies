import { useEffect, useState } from 'react';
import { OnboardingStepItem } from '../../../../../../types/fields';

type FormProps = {
  fields: OnboardingStepItem[];
};

export default function OnboardingOrder({ fields }: FormProps) {
  const [onboardingOrder, setOnboardingOrder] = useState<string[]>([] as string[]);
  const [loading, setLoading] = useState(false);

  async function submitOrder() {
    setLoading(true);
    const res = await fetch('https://field-manager.aerilym.workers.dev/options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: 'onboardingOrder',
        value: onboardingOrder,
      }),
    });

    if (res.status !== 200 && res.status !== 201) {
      alert('Something went wrong saving the field: ' + res.statusText);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (fields.length === 0) return;

    fetch('https://field-manager.aerilym.workers.dev/options?key=onboardingOrder').then(
      async (response) => {
        const { value } = await response.json();

        const allowedFields = fields.map((item) => item.field);

        const filteredOrder = value.filter((item: string) => allowedFields.includes(item));

        setOnboardingOrder(filteredOrder);

        const unknownFields = value.filter((item: string) => !allowedFields.includes(item));

        if (unknownFields.length > 0) {
          alert(
            'The following fields were saved to the onboarding order list but not found: ' +
              unknownFields.join(', ')
          );
        }
      }
    );
  }, [fields]);
  return (
    <div className="onboarding-order">
      <h3>Onboarding Order</h3>
      {onboardingOrder.length > 0 ? (
        <ul>
          {onboardingOrder.map((field, index) => (
            <li key={index}>
              <button
                name={field}
                className="order-up"
                onClick={() => {
                  if (index > 0) {
                    const newOrder = [...onboardingOrder];
                    newOrder[index] = newOrder[index - 1];
                    newOrder[index - 1] = field;
                    setOnboardingOrder(newOrder);
                  }
                }}
                disabled={index === 0}
              >
                ^
              </button>
              <button
                name={field}
                className="order-down"
                onClick={() => {
                  if (index < onboardingOrder.length - 1) {
                    const newOrder = [...onboardingOrder];
                    newOrder[index] = newOrder[index + 1];
                    newOrder[index + 1] = field;
                    setOnboardingOrder(newOrder);
                  }
                }}
                disabled={index === onboardingOrder.length - 1}
              >
                v
              </button>
              <p className="order-pos">{index + 1}</p>
              <select
                value={field}
                required
                onChange={(e) => {
                  const newOrder = [...onboardingOrder];
                  newOrder[index] = e.target.value;
                  setOnboardingOrder(newOrder);
                }}
              >
                {fields
                  .map((item) => item.field)
                  .filter((item) => !onboardingOrder.includes(item) || item === field)
                  .map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
              </select>
              {/* <input
                type="text"
                value={field}
                onChange={(e) => {
                  const newOrder = [...onboardingOrder];
                  newOrder[index] = e.target.value;
                  setOnboardingOrder(newOrder);
                }}
              /> */}
              <button
                name={field}
                className="order-delete"
                onClick={() => {
                  const newOrder = [...onboardingOrder];
                  newOrder.splice(index, 1);
                  setOnboardingOrder(newOrder);
                }}
              >
                x
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No fields have been added yet.</p>
      )}
      <button
        disabled={loading || fields.length === onboardingOrder.length}
        onClick={() => {
          const newOrder = [...onboardingOrder];
          const newField = fields
            .map((item) => item.field)
            .find((item) => !onboardingOrder.includes(item));
          if (!newField) return;
          newOrder.push(newField);
          setOnboardingOrder(newOrder);
        }}
      >
        Add Field
      </button>
      <button
        disabled={loading}
        onClick={() => {
          submitOrder();
        }}
      >
        Submit Order
      </button>
    </div>
  );
}
