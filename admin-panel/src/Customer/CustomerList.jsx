import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  ShowButton,
  SearchInput,
} from 'react-admin';

const CustomersList = (props) => (
  <List {...props} filters={[< SearchInput source="q" alwaysOn/>]}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <EditButton />
    </Datagrid>
  </List>
);

export default CustomersList;
