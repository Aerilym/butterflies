import Header from '../../components/utility/Header';

import '../../styles/config/internal/dashboard.css';

export default function WebhookManager() {
  return (
    <div className="container">
      <Header title="Webhook Manager" description="Manage the webhooks." />
      <a href="https://dash.cloudflare.com/7f20871ca027970f0b1a306e863689ea/workers/kv/namespaces/43fa138323a14985b7226b36610ff26d">
        Clickup Space to Zulip Topic Map (Cloudflare KV STORE)
      </a>
    </div>
  );
}
