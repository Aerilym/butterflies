import React, { useEffect, useState } from 'react';

import Header from '../../components/Header';

import '../../styles/config/onboarding/Form.css';
import Loading from '../../components/Loading';
import Table, { TableColumn, TableData, TableProps } from '../../components/Table';
import { supabaseAdminAuthClient } from '../../supabase';
import { User } from '@supabase/supabase-js';
import { useLoaderData } from 'react-router-dom';

export default function UserFields() {
  const [loading, setLoading] = useState(true);

  const { data, columns } = useLoaderData() as TableProps;

  return (
    <div className="container">
      <Header title="User Config" description="User config" />
      <Table columns={columns} data={data} />
    </div>
  );
}
