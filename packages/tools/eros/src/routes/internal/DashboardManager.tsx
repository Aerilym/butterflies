import React, { useEffect, useState } from 'react';
import { DashboardItem } from '../../../../../types/dashboard';
import DashboardItemBlock from '../../components/config/dashboard/DashboardItemBlock';
import DashboardItemForm from '../../components/config/dashboard/DashboardItemForm';
import Header from '../../components/Header';

import Dashboard from '../../../../dashboard/src/components/Dashboard';

import '../../styles/config/internal/dashboard.css';
import LinkRow from '../../components/LinkingRow';

interface IndexedItem {
  index: number;
  item: DashboardItem;
}

export default function DashboardManager() {
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([] as DashboardItem[]);
  const [dashboardPreviewItems, setDashboardPreviewItems] = useState<DashboardItem[]>(
    [] as DashboardItem[]
  );
  const [indexedItems, setIndexedItems] = useState<IndexedItem[]>([] as IndexedItem[]);
  const [sections, setSections] = useState<string[]>([] as string[]);
  const [showForm, setShowForm] = useState(false);

  async function handleSubmit(item: DashboardItem, index: number) {
    const newItems = [...dashboardItems];
    newItems[index] = item;

    const res = await fetch('https://field-manager.aerilym.workers.dev/options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: 'dashboardItems',
        value: newItems,
      }),
    });

    if (res.status === 200 || res.status === 201) {
      setDashboardItems(newItems);
    } else {
      alert('Something went wrong saving the item: ' + res.statusText);
    }
  }

  function updatePreviewItems(item: DashboardItem, index: number) {
    const newItems = [...dashboardPreviewItems];
    newItems[index] = item;
    setDashboardPreviewItems(newItems);
  }

  useEffect(() => {
    fetch('https://field-manager.aerilym.workers.dev/options?key=dashboardItems').then(
      async (res) => {
        const { value } = await res.json();
        const parsedValue = JSON.parse(value) as DashboardItem[];
        const secs = [...new Set(parsedValue.map((item: DashboardItem) => item.section))];
        const indexedItems = parsedValue.map((item, index) => {
          return {
            index,
            item,
          };
        });
        setIndexedItems(indexedItems);
        setDashboardItems(parsedValue);
        setDashboardPreviewItems(parsedValue);
        setSections(secs);
      }
    );
  }, []);
  return (
    <div className="container">
      <Header title="Dashboard Manager" description="Manage the links on the internal dashboard." />
      <a href="https://dashboard.aerilym.com" target="_blank" rel="noopener noreferrer">
        Dashboard
      </a>
      <div className="content">
        <div className="new-field-container">
          {showForm ? (
            <button
              className="cancel-field"
              onClick={() => {
                setShowForm(!showForm);
              }}
            >
              Cancel
            </button>
          ) : (
            <button
              className="create-field"
              onClick={() => {
                setShowForm(!showForm);
              }}
            >
              Create New Link
            </button>
          )}
          <DashboardItemForm data={dashboardItems} sections={sections} visible={showForm} />
        </div>
        <div className="dashboard-edit-container">
          <div className="dashboard-sections">
            {[...new Set(indexedItems.map((item: IndexedItem) => item.item.section))].map(
              (section) => {
                return (
                  <div key={section} className="dashboard-section">
                    <h2>{section.charAt(0).toLocaleUpperCase() + section.substring(1)}</h2>
                    {indexedItems
                      .filter((item) => item.item.section === section)
                      .map((indexedItem) => {
                        return (
                          <DashboardItemBlock
                            key={indexedItem.index}
                            dataItem={indexedItem.item}
                            sections={sections}
                            itemIndex={indexedItem.index}
                            handleUpdate={handleSubmit}
                            handlePreviewUpdate={updatePreviewItems}
                          />
                        );
                      })}
                  </div>
                );
              }
            )}
          </div>
          <div className="dashboard-preview">
            <h1>Live Preview</h1>
            {dashboardPreviewItems.length > 0 ? (
              <Dashboard data={[...new Set(dashboardPreviewItems)]} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
