import { Link } from 'react-router-dom';

interface LinkRowProps {
  // props go here
  label: string; // label to display on the button
  target: string; // Target to navigate to when the button is clicked
  description: string; // Description to display on the button
}

const LinkRow: React.FC<LinkRowProps> = ({ label, target, description }) => {
  return (
    <Link to={target} className="linking-row">
      <div className="label">{label}</div>
      <div className="description">{description}</div>
    </Link>
  );
};

export default LinkRow;
