import LinkingRow from '../../components/utility/LinkingRow';
import { configLinks } from '../Config';

export default function ConfigBase() {
  return (
    <div className="container">
      <div className="content">
        <div className="nav-page">
          {configLinks.map((link) => (
            <LinkingRow
              key={link.label}
              label={link.label}
              target={link.target}
              description={link.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
