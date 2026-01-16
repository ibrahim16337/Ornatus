import React from "react";
import { Menu } from "react-admin";


const CustomMenu = () => {
  return (
    <Menu
    >
      <Menu.DashboardItem />
      <Menu.ResourceItem name="Dashboard" />
      <Menu.ResourceItem name="Products" />
      <Menu.ResourceItem name="Orders" />
      <Menu.ResourceItem name="Customers" />
      <Menu.ResourceItem name="Sales" />
    </Menu>
  );
};

export default CustomMenu;
