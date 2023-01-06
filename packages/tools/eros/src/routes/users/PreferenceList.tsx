import Header from '../../components/Header';

import '../../styles/config/onboarding/Form.css';
import Table, { TableProps } from '../../components/Table';
import { useLoaderData } from 'react-router-dom';

export default function PreferenceList() {
  const { data, columns } = useLoaderData() as TableProps;

  return (
    <div className="container">
      <Header title="User Config" description="User config" />
      <Table columns={columns} data={data} />
    </div>
  );
}
