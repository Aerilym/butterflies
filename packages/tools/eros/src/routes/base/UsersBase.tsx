import LinkingRow from '../../components/utility/LinkingRow';
import { usersLinks } from '../Users';

export default function UsersBase() {
  return (
    <div className="container">
      <div className="content">
        <div className="nav-page">
          {usersLinks.map((link) => (
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
