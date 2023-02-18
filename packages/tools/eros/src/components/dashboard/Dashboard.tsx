import React from 'react';

import LinkButton from './LinkButton';
import LinkRow from './LinkRow';
import type { DashboardItem } from '../../../../../types/dashboard';

import '../../styles/dashboard/dashboard.css';

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
      <h2>Engineering</h2>
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
      <h2>General</h2>
      <div
        id="general"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          width: 'calc(92% + 40px)',
          maxWidth: '2700px',
        }}
      >
        {generalSection}
      </div>
      <div
        id="section-group"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          flexWrap: 'wrap',
          width: '100%',
          marginTop: '0',
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
  return buildDashboard(data);
};

export default Dashboard;
