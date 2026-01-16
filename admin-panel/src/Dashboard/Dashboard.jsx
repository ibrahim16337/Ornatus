import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import prod from './prod-2.png';

const Dashboard = () => {
  // Dummy sales data
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun' , 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Sales',
        data: [10, 20, 15, 25, 30, 22, 21, 10],
        backgroundColor: 'orange',
        borderWidth: 2,
      },
    ],
  };

  // Define topSellingProducts outside the useEffect hook
  const topSellingProducts = [
    {
      image: prod,
      title: 'King Sized Wooden Bed',
      price: '$19.99',
    },
    {
      image: prod,
      title: 'Side Table',
      price: '$29.99',
    },
    {
        image: prod,
        title: 'Dresser',
        price: '$19.99',
      },
      {
        image: prod,
        title: 'Lamp',
        price: '$29.99',
      },
    // Add more products as needed
  ];
  const navigate = useNavigate();

  const handleOrderClick = () => {
    // Navigate to the "Orders" resource in App.js
    navigate('/Orders'); // Replace '/Orders' with the actual path to your Orders resource
  };

  useEffect(() => {
    // Get the sales graph canvas element
    const salesGraphCanvas = document.getElementById('salesGraph');

    // Create a sales graph using Chart.js
    const salesGraph = new Chart(salesGraphCanvas, {
      type: 'bar',
      data: salesData,
      options: {
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              color: 'rgba(0,0,0,0.1)',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
          },
        },
        indexAxis: 'x',
        barPercentage: 0.6,
      },
    });

    // Clean up the chart when the component unmounts
    return () => {
      salesGraph.destroy();
    };
  }, []);

  return (
    <div className='dash-main'>
      <h1 className='dash-welcome'>Welcome to Your Dashboard</h1>

      <div className='dash-upper'>

        <div className='sales-card-div'>
          <h5 className='sales-title'>Sales Dashboard</h5>
          <canvas id='salesGraph' className='salesGraph'></canvas>
        </div>

        <div className='top-selling-div'>
  <h5 className='sales-title'>Top Selling</h5>

  <div className='product-list'>
    {topSellingProducts.map((product, index) => (
      <div key={index} className='product-item'>
        <img src={product.image} alt={product.title} className='prod-img' />
        <div>
          <p className='product-title'>{product.title}</p>
          <p className='product-price'>{product.price}</p>
        </div>
      </div>
    ))}
  </div>
</div>


      </div>

      <div className='dash-orders'>
      <h5 className='sales-title'>Orders</h5>

      <div className='order-cards'>
      <div className='new-orders-div' onClick={handleOrderClick}>
        <h2 className='order-card-title'>New Orders</h2>
        <h2 className='order-card-title'>100</h2>

      </div>

      <div className='pending-orders-div' onClick={handleOrderClick}>
        <h2 className='order-card-title'>Pending </h2>
        <h2 className='order-card-title'>20</h2>

      </div>

      <div className='deliv-orders-div' onClick={handleOrderClick}>
        <h2 className='order-card-title'>Delivered </h2>
        <h2 className='order-card-title'>80</h2>

      </div>

      </div>

      </div>
    </div>
  );
};

export default Dashboard;
