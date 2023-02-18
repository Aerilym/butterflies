import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';

import type { DashboardItem } from '../../../../../../types/dashboard';

type FormProps = {
  dataItem: DashboardItem;
  sections: string[];
  itemIndex: number;
  handleUpdate: (item: DashboardItem, index: number) => void;
  handlePreviewUpdate: (item: DashboardItem, index: number) => void;
};

export default function DashboardItemBlock({
  dataItem,
  itemIndex,
  sections,
  handleUpdate,
  handlePreviewUpdate,
}: FormProps) {
  const [item, setItem] = useState<DashboardItem>({} as DashboardItem);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleUpdate(item, itemIndex);
  }

  React.useEffect(() => {
    setItem(dataItem);
  }, [dataItem]);

  React.useEffect(() => {
    if (item.label) handlePreviewUpdate(item, itemIndex);
  }, [item]);

  return (
    <div className="dashboard-item">
      {/*Tooltips that will always have rendered anchor points can be put here, otherwise the tooltip should be rendered with the element it is anchored to. */}
      <Tooltip anchorId="item-section" place="right" />
      <Tooltip anchorId="item-label" place="right" />
      <Tooltip anchorId="item-url" place="right" />
      <Tooltip anchorId="item-description" place="right" />
      <Tooltip anchorId="item-icon" place="right" />
      <Tooltip anchorId="item-expanded" place="right" />

      <form onSubmit={handleSubmit} className="item-form">
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
                {section.charAt(0).toLocaleUpperCase() + section.substring(1)}
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
            id="field-bucket"
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
            onChange={(e) =>
              setItem(
                e.target.checked
                  ? { ...item, expanded: e.target.checked }
                  : { ...item, expanded: undefined }
              )
            }
          />
          Expanded
        </label>
        <input
          type="submit"
          value="Update"
          disabled={Object.keys(item).every(
            (key) => dataItem[key as keyof DashboardItem] === item[key as keyof DashboardItem]
          )}
        />
      </form>
    </div>
  );
}
