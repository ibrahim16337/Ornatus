import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  ShowButton,
  SearchInput,
  NumberField
} from 'react-admin';

const SalesList = (props) => (
  <List {...props} filters={[< SearchInput source="q" alwaysOn/>]}>
    <Datagrid>
    <NumberField source="id" textAlign="left" />
      <TextField source="Product Name" />
      <TextField source="Sales" />
      <TextField source="Stock" />
      <EditButton />
    </Datagrid>
  </List>
);

export default SalesList;