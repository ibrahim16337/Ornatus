import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
} from 'react-admin';

const OrdersShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <NumberField source="id" />
      <TextField source="user_id" />
      <TextField source="amount" />
    </SimpleShowLayout>
  </Show>
);

export default OrdersShow;
