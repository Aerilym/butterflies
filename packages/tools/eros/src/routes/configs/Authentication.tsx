import AuthProviders from '../../components/config/authentication/AuthProviders';
import Header from '../../components/utility/Header';

export default function Authentication() {
  return (
    <div className="container">
      <Header title="Authentication Config" description="Authentication config" />
      <div className="content">
        <AuthProviders />
      </div>
    </div>
  );
}
