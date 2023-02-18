import LinkingRow from '../../components/utility/LinkingRow';
import { internalLinks } from '../Internal';

export default function InternalBase() {
  return (
    <div className="container">
      <div className="content">
        <div className="nav-page">
          {internalLinks.map((link) => (
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
