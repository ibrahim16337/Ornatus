import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
} from 'react-admin';

const OrdersCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
    <NumberInput source="id" />
      <TextInput source="user_id" />
      <TextInput source="amount" />
    </SimpleForm>
  </Create>
);

export default OrdersCreate;
