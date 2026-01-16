import * as React from 'react';
import { List, Datagrid, TextField, EditButton , SimpleList ,CreateButton , SearchInput, ImageField } from 'react-admin';


const productListConfig = [
  { label: 'ID', source: 'id', textAlign: 'left' },
  { label: 'Name', source: 'name' },
  { label: 'Price', source: 'price' },
  { label: 'Description', source: 'description' },
  { label: 'Stock', source: 'stock' },
  { label: 'Image', source: 'image', field: <ImageField source="image" /> }, // Example for displaying images
];

const ProductList = (props) => (
  <List {...props} filters={[< SearchInput source="q" alwaysOn/>]} title="Products">
    <Datagrid>
    {productListConfig.map(field => (
        <React.Fragment key={field.source}>
          {field.field ? field.field : <TextField source={field.source} label={field.label} />}
        </React.Fragment>
      ))}
    <EditButton />
    </Datagrid>
  </List>
);

export default ProductList;
