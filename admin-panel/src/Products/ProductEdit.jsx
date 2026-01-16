import * as React from 'react';
import { Edit, SimpleForm, TextInput, ImageField, ImageInput } from 'react-admin';

const ProductEdit = () => (
  <Edit >
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="price" />
      <TextInput source="description" />
      <TextInput source="stock" />
      <ImageInput source="pictures" label="Related pictures">
        <ImageField source="image" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);

export default ProductEdit;
