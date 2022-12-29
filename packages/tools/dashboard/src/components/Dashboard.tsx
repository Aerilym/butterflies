import React from 'react';
import '../dashboard.css'; // import the CSS file

import LinkButton from './LinkButton';
import LinkRow from './LinkRow';
import { DashboardItem } from '../../../../types/dashboard';

interface DashboardProps {
  data: DashboardItem[];
}

function weakURL(url: string) {
  try {
    return new URL(url);
  } catch (e) {
    console.warn(`Invalid URL: ${url}`);
    return url;
  }
}

function getURLHost(url: URL | string) {
  if (typeof url === 'string') {
    return url;
  }
  let host = url.hostname.replace('www.', '').replace('.com', '');
  if (host.includes('.')) host = host.split('.').slice(-1)[0];
  return host;
}

function getIcon(item: DashboardItem) {
  const url = weakURL(item.url);
  const host = getURLHost(url);
  return host;
}

function buildDashboard(items: DashboardItem[]) {
  items.sort((a, b) => {
    return a.label.localeCompare(b.label);
  });
  const generalItems = items.filter((item) => item.section === 'general');
  const developmentItems = items.filter((item) => item.section === 'development');
  const designItems = items.filter((item) => item.section === 'design');
  const toolItems = items.filter((item) => item.section === 'tool');

  const generalButtons = generalItems
    .filter((item) => item.expanded !== true)
    .map((item) => (
      <LinkButton
        key={item.url}
        label={item.label}
        url={item.url}
        icon={item.icon ?? getIcon(item)}
      />
    ));

  const generalExpanded = generalItems
    .filter((item) => item.expanded === true)
    .map((item) => (
      <LinkRow key={item.url} label={item.label} url={item.url} icon={item.icon ?? getIcon(item)} />
    ));

  const generalSection = (
    <div className="section">
      <div className="button-group">{generalButtons}</div>
      <div
        className="general-expanded"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {generalExpanded}
      </div>
    </div>
  );

  const developmentButtons = developmentItems
    .filter((item) => item.expanded !== true)
    .map((item) => (
      <LinkButton
        key={item.url}
        label={item.label}
        url={item.url}
        icon={item.icon ?? getIcon(item)}
      />
    ));
  const developmentExpanded = developmentItems
    .filter((item) => item.expanded === true)
    .map((item) => (
      <LinkRow key={item.url} label={item.label} url={item.url} icon={item.icon ?? getIcon(item)} />
    ));

  const developmentSection = (
    <div className="section-col">
      <h2>Development</h2>
      <div className="section">
        <div className="button-group">{developmentButtons}</div>
        {developmentExpanded}
      </div>
    </div>
  );

  const designButtons = designItems
    .filter((item) => item.expanded !== true)
    .map((item) => (
      <LinkButton
        key={item.url}
        label={item.label}
        url={item.url}
        icon={item.icon ?? getIcon(item)}
      />
    ));
  const designExpanded = designItems
    .filter((item) => item.expanded === true)
    .map((item) => (
      <LinkRow key={item.url} label={item.label} url={item.url} icon={item.icon ?? getIcon(item)} />
    ));
  const designSection = (
    <div className="section-col">
      <h2>Design</h2>
      <div className="section">
        <div className="button-group">{designButtons}</div>
        {designExpanded}
      </div>
    </div>
  );

  const toolButtons = toolItems
    .filter((item) => item.expanded !== true)
    .map((item) => (
      <LinkButton
        key={item.url}
        label={item.label}
        url={item.url}
        icon={item.icon ?? getIcon(item)}
      />
    ));
  const toolExpanded = toolItems
    .filter((item) => item.expanded === true)
    .map((item) => (
      <LinkRow key={item.url} label={item.label} url={item.url} icon={item.icon ?? getIcon(item)} />
    ));
  const toolSection = (
    <div className="section-col">
      <h2>Tools</h2>
      <div className="section">
        <div className="button-group">{toolButtons}</div>
        {toolExpanded}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <h2>General</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '2700px',
        }}
      >
        {generalSection}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          flexWrap: 'wrap',
          width: '100%',
          maxWidth: '2700px',
        }}
      >
        {developmentSection}
        {designSection}
        {toolSection}
      </div>
    </div>
  );
}

const Dashboard: React.FC<DashboardProps> = ({ data }: DashboardProps) => {
  return <div className="dashboard">{buildDashboard(data)}</div>;
};

export default Dashboard;
