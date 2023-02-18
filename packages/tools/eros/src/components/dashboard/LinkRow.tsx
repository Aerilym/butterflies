interface LinkRowProps {
  // props go here
  label: string; // label to display on the button
  url: string; // URL to open when the button is clicked
  icon: string; // name of the icon to display (from an icon font library such as Font Awesome)
}

const LinkRow: React.FC<LinkRowProps> = ({ label, url, icon }) => {
  return (
    <div className="neo-container">
      <a href={url} target="_blank" rel="noopener noreferrer" className="link-row">
        <div className="icon">
          {/* <img alt={label} src={`https://simpleicons.org/icons/${icon}.svg`}></img> */}
          <img
            onError={(e) => {
              // @ts-ignore
              e.target.onerror = null;
              // @ts-ignore
              e.target.src = `https://www.google.com/s2/favicons?domain=${url}&sz=256`;
            }}
            alt={label}
            src={`/images/icons/${icon}.svg`}
          />
        </div>
        <div className="label">{label}</div>
        <div className="neo-bottom later rectangle-button"></div>
        <div className="neo-bottom start rectangle-button"></div>
      </a>
    </div>
  );
};

export default LinkRow;
