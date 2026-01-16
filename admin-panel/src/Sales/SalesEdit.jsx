import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
} from 'react-admin';

const SalesEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <NumberInput source="id" />
      <TextInput source="Product Name" />
      <NumberInput source="Sales" />
      <NumberInput source="Stock" />
    </SimpleForm>
  </Edit>
);

export default SalesEdit;