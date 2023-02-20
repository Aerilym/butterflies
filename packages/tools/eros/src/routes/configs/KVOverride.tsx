import { useState } from 'react';

import Loading from '../../components/utility/Loading';

interface KV {
  key: string;
  value: string;
}

export default function KVOverride() {
  const [kv, setKV] = useState<KV>({} as KV);
  const [kvLookup, setKVLookup] = useState<KV>({} as KV);
  const [loading, setLoading] = useState(false);

  async function submitKV() {
    setLoading(true);
    const res = await fetch('https://field-manager.butterfliesapp.workers.dev/options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kv),
    });

    if (res.status !== 200 && res.status !== 201) {
      alert('Something went wrong saving the field: ' + res.statusText);
    }
    setLoading(false);
  }

  async function lookupKV() {
    setLoading(true);
    fetch(`https://field-manager.butterfliesapp.workers.dev/options?key=${kvLookup.key}`).then(
      async (response) => {
        const { value } = await response.json();

        if (!!value) setKVLookup({ ...kvLookup, value: JSON.stringify(value) });
        setLoading(false);
      }
    );
  }

  return (
    <div className="onboarding-order">
      {loading ? <Loading /> : null}
      <h3>KV lookup</h3>
      <label htmlFor="lookup-key">
        Key:
        <input
          type="text"
          id="lookup-key"
          required
          value={kvLookup.key}
          onChange={(e) => setKVLookup({ ...kvLookup, key: e.target.value })}
        />
      </label>
      <label htmlFor="lookup-value">
        Value:
        <input type="text" id="field-value" value={kvLookup.value} />
      </label>
      <button
        disabled={loading}
        onClick={() => {
          lookupKV();
        }}
      >
        Lookup KV
      </button>
      {kvLookup.value ? (
        <button
          disabled={loading}
          onClick={() => {
            setKV(kvLookup);
          }}
        >
          Edit KV
        </button>
      ) : null}
      <h3>KV Adding & Modifying</h3>
      <label htmlFor="field-key">
        Key:
        <input
          type="text"
          id="field-key"
          required
          value={kv.key}
          onChange={(e) => setKV({ ...kv, key: e.target.value })}
        />
      </label>
      <label htmlFor="field-value">
        Value:
        <input
          type="text"
          id="field-value"
          required
          value={kv.value}
          onChange={(e) => setKV({ ...kv, value: e.target.value })}
        />
      </label>
      <button
        disabled={loading}
        onClick={() => {
          submitKV();
        }}
      >
        Submit KV
      </button>
    </div>
  );
}
