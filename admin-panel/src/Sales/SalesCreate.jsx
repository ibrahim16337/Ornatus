import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
} from 'react-admin';

const SalesCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="Product Name" />
      <NumberInput source="Sales" />
      <NumberInput source="Stock" />
    </SimpleForm>
  </Create>
);

export default SalesCreate;