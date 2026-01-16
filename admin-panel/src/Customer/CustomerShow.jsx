import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
} from 'react-admin';

const CustomersShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
    </SimpleShowLayout>
  </Show>
);

export default CustomersShow;