import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
} from 'react-admin';

const SalesShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
    <NumberField source="id" textAlign="left" />
      <TextField source="Product Name" />
      <NumberField source="Sales" />
      <NumberField source="Stock" />
    </SimpleShowLayout>
  </Show>
);

export default SalesShow;