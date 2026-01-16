import * as React from 'react';
import { Admin, Resource, Layout } from 'react-admin';
import { FaBoxOpen } from 'react-icons/fa';
import dataProvider from './Dataprovider';
// import {
//   ListGuesser,
//   EditGuesser,
//   ShowGuesser,
//   Create,
// } from 'react-admin';
import Dashboard from './Dashboard/Dashboard';
import CustomMenu from "./CustomMenu/CustomMenu";
import { radiantLightTheme, radiantDarkTheme } from 'react-admin';
import authProvider from './Authprovider';
import Products from './Products/Products';
//import Sales from './Sales/Sales';
import Customers from './Customer/Customers';
import Order from './Order/Order';

const CustomLayout = (props) => <Layout {...props}  menu={CustomMenu} />;

const App = () => (
  <Admin dataProvider={dataProvider} dashboard={Dashboard} layout={CustomLayout} theme={radiantLightTheme}
    darkTheme={radiantDarkTheme} authProvider={authProvider}>
    <Resource name="Products" {...Products} icon={FaBoxOpen} />
    <Resource name="Orders" {...Order} />
     {/* <Resource name="Sales" {...Sales} /> */}
    <Resource name="Users" {...Customers} />
  </Admin>
);

export default App;
