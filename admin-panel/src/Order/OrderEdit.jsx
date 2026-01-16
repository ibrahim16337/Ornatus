import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
} from 'react-admin';

const OrdersEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <NumberInput source="id" />
      <TextInput source="user_id" />
      <TextInput source="amount" />
    </SimpleForm>
  </Edit>
);

export default OrdersEdit;
