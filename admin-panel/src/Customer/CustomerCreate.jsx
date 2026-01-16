import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
} from 'react-admin';

const CustomersCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Create>
);

export default CustomersCreate;