import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { DashboardItem } from '../../../../../../types/dashboard';
import Loading from '../../Loading';

type FormProps = {
  data?: DashboardItem[];
  sections: string[];
  visible: boolean;
};

export default function DashboardItemForm({ data, sections, visible }: FormProps) {
  const [item, setItem] = useState({} as DashboardItem);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    data?.push(item);

    const res = await fetch('https://field-manager.aerilym.workers.dev/options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: 'dashboardItems',
        value: JSON.stringify(data),
      }),
    });

    if (res.status !== 200 && res.status !== 201) {
      alert('Something went wrong saving the item: ' + res.statusText);
    }
    setLoading(false);
  }

  return (
    <div className="new-item-form">
      {loading ? <Loading /> : null}

      {/*Tooltips that will always have rendered anchor points can be put here, otherwise the tooltip should be rendered with the element it is anchored to. */}
      <Tooltip anchorId="item-section" place="right" />
      <Tooltip anchorId="item-label" place="right" />
      <Tooltip anchorId="item-url" place="right" />
      <Tooltip anchorId="item-description" place="right" />
      <Tooltip anchorId="item-icon" place="right" />
      <Tooltip anchorId="item-expanded" place="right" />

      <form
        onSubmit={handleSubmit}
        className="item-form"
        style={{
          visibility: visible ? 'visible' : 'hidden',
          height: visible ? 'auto' : '0',
        }}
      >
        <label htmlFor="item-section">
          Section:
          <select
            id="item-section"
            data-tooltip-content="The section this link should be in"
            value={item.section}
            required
            onChange={(e) => {
              setItem({ ...item, section: e.target.value });
            }}
          >
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="item-label">
          Label:
          <input
            type="text"
            id="item-label"
            data-tooltip-content="The name of the item that is shown on the dashboard"
            required
            value={item.label}
            onChange={(e) => setItem({ ...item, label: e.target.value })}
          />
        </label>
        <label htmlFor="item-url">
          URL:
          <input
            type="text"
            id="item-url"
            data-tooltip-content="The URL the link goes to"
            required
            value={item.url}
            onChange={(e) => setItem({ ...item, url: e.target.value })}
          />
        </label>
        <label htmlFor="item-description">
          Description:
          <input
            type="text"
            id="item-description"
            data-tooltip-content="The Item description that is shown on the dashboard"
            value={item.description}
            onChange={(e) => setItem({ ...item, description: e.target.value })}
          />
        </label>
        <label htmlFor="item-icon">
          Icon override:
          <input
            type="text"
            id="item-icon"
            data-tooltip-content="Only put this in if you want to override the icon that is automatically generated from the URL"
            value={item.icon}
            onChange={(e) => setItem({ ...item, icon: e.target.value })}
          />
        </label>
        <label htmlFor="item-expanded" className="checkbox">
          <input
            type="checkbox"
            id="item-expanded"
            data-tooltip-content="Indicates whether to display the item as an expanded link with its abel or as a primary link button"
            checked={item.expanded}
            onChange={(e) => setItem({ ...item, expanded: e.target.checked })}
          />
          Expanded
        </label>
        <input type="submit" value="Submit" disabled={loading} />
      </form>
    </div>
  );
}
