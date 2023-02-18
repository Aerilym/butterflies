import { useLoaderData } from 'react-router-dom';

import Header from '../../components/utility/Header';
import Table, { TableProps } from '../../components/utility/Table';

import '../../styles/config/onboarding/Form.css';

export default function MatchesList() {
  const { data, columns } = useLoaderData() as TableProps;

  return (
    <div className="container">
      <Header title="User Config" description="User config" />
      <Table columns={columns} data={data} />
    </div>
  );
}
