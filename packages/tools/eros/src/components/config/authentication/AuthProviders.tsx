import { useEffect, useState } from 'react';
import { validAuthProviders } from '../../../../../../types/fields';

export default function AuthProviders() {
  const [providerOrder, setProviderOrder] = useState<string[]>([] as string[]);
  const [loading, setLoading] = useState(false);

  async function submitOrder() {
    setLoading(true);
    const res = await fetch('https://field-manager.aerilym.workers.dev/options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: 'providerOrder',
        value: providerOrder,
      }),
    });

    if (res.status !== 200 && res.status !== 201) {
      alert('Something went wrong saving the field: ' + res.statusText);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetch('https://field-manager.aerilym.workers.dev/options?key=providerOrder').then(
      async (response) => {
        const { value } = await response.json();

        const filteredOrder = value.filter((provider: string) =>
          validAuthProviders.includes(provider)
        );

        setProviderOrder(filteredOrder);
      }
    );
  }, []);
  return (
    <div className="onboarding-order">
      <h3>Provider Order</h3>
      {providerOrder.length > 0 ? (
        <ul>
          {providerOrder.map((field, index) => (
            <li key={index}>
              <button
                name={field}
                className="order-up"
                onClick={() => {
                  if (index > 0) {
                    const newOrder = [...providerOrder];
                    newOrder[index] = newOrder[index - 1];
                    newOrder[index - 1] = field;
                    setProviderOrder(newOrder);
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
                  if (index < providerOrder.length - 1) {
                    const newOrder = [...providerOrder];
                    newOrder[index] = newOrder[index + 1];
                    newOrder[index + 1] = field;
                    setProviderOrder(newOrder);
                  }
                }}
                disabled={index === providerOrder.length - 1}
              >
                v
              </button>
              <p className="order-pos">{index + 1}</p>
              <select
                value={field}
                required
                onChange={(e) => {
                  const newOrder = [...providerOrder];
                  newOrder[index] = e.target.value;
                  setProviderOrder(newOrder);
                }}
              >
                {validAuthProviders
                  .filter((item) => !providerOrder.includes(item) || item === field)
                  .map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
              </select>
              <button
                name={field}
                className="order-delete"
                onClick={() => {
                  const newOrder = [...providerOrder];
                  newOrder.splice(index, 1);
                  setProviderOrder(newOrder);
                }}
              >
                x
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No providers have been added yet.</p>
      )}
      <button
        disabled={loading}
        onClick={() => {
          const newOrder = [...providerOrder];
          const newField = validAuthProviders.find((item) => !providerOrder.includes(item));
          if (!newField) return;
          newOrder.push(newField);
          setProviderOrder(newOrder);
        }}
      >
        Add Provider
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
