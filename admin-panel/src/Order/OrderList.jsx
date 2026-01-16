import * as React from "react";
import { List, Datagrid, TextField, SearchInput, EditButton , NumberField } from "react-admin";

const OrderList = (props) => {
  return (
        <List
        filters={[< SearchInput source="q" alwaysOn/>]}
          {...props}
        >
          <Datagrid>
            <NumberField source="id" textAlign="left" />
            <TextField source="user_id" />
            <TextField source="amount" />
            <EditButton />
          </Datagrid>
        </List>
  );
};

export default OrderList;
