import * as React from 'react';
import { Show, SimpleShowLayout, TextField , NumberField } from 'react-admin';

const ProductShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
    <NumberField source="id" textAlign="left" />
      
      <TextField source="title" />
      <TextField source="content" />
      
      
    </SimpleShowLayout>
  </Show>
);

export default ProductShow;
