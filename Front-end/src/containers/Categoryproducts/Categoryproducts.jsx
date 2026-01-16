import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/ProductsService";
import "./categoryproducts.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Pagination from "react-bootstrap/Pagination";
//import prod from "./prod-2.png";
import Dropdown from "react-bootstrap/Dropdown";
import { RiArrowDropDownLine } from "react-icons/ri";
//import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Categoryproducts = ({category,style}) => {
  //const { category } = useParams(); // Get the selected category from URL parameter
  console.log("From the Category Products",category);
  // const [appliedFilter, setAppliedFilter] = useState("All");
  // const [sortOrder, setSortOrder] = useState("asc");
  // const [bestSellingSortOrder, setBestSellingSortOrder] = useState("asc");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [sortOption, setSortOption] = useState({ sortBy: "name", sortOrder: "asc" });

  const handleFilterChange = (filter) => {
    setAvailabilityFilter(filter);
    setCurrentPage(1);
  };

  const handleSortChange = (sortBy, sortOrder) => {
    setSortOption({ sortBy, sortOrder });
    setCurrentPage(1);
  };
  const productsPerPage = 8;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  // const indexOfLastProduct = currentPage * productsPerPage;
  // const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // //const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  useEffect(() => {
    if(style == null){
      productService
      .getProductsByCategory(category, sortOption.sortBy, sortOption.sortOrder, availabilityFilter)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
    }
    else{
      productService
      .getProductsByStyle(style, sortOption.sortBy, sortOption.sortOrder, availabilityFilter)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
    }
  }, [category,style, sortOption, availabilityFilter]);
console.log("From the category Products",category,sortOption,availabilityFilter);
console.log(products)
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!products || products.length === 0) {
    return <p>No products available for this category</p>;
  }


  return (
    <div className="category-main">

      <div className="category-subdiv">
        <div className="breadcrumb-div">
          <Breadcrumb>
            <Breadcrumb.Item href="/" className="breadcrumb-item">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/collections/all" className="breadcrumb-item">
              Shop
            </Breadcrumb.Item>
            <Breadcrumb.Item active className="breadcrumb-item">
            {(category === 'all')? category = 'Products' : category}
            </Breadcrumb.Item>
          </Breadcrumb>
          <hr className="sepration" />
        </div>

        <div className="filter-sorting-div">
        <div className="filters-div">
          <label htmlFor="" className="filter-label">
            Filters:
          </label>
          <Dropdown className="filter-dropdown">
            <Dropdown.Toggle variant="secondary" className="filter-dropdown">
              Availability <RiArrowDropDownLine className="drop-icon" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFilterChange("All")}>All</Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilterChange("In Stock")}>In Stock</Dropdown.Item>
              <Dropdown.Item onClick={() => handleFilterChange("Out Of Stock")}>Out Of Stock</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="filters-div">
          <Dropdown className="filter-dropdown">
            <Dropdown.Toggle variant="secondary" className="filter-dropdown">
              Sort By<RiArrowDropDownLine className="drop-icon" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSortChange("name", "asc")}>Alphabetically, A-Z</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange("name", "desc")}>Alphabetically, Z-A</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange("price", "asc")}>Price Low to High</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange("price", "desc")}>Price High to Low</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>


        <Row md={4}>
        {products.data.map((product) => (
          <Col key={product.id}>
            <Link to={`/collections/${category}/products/${product.timestamp_id}`}>

              <div className="product-card">
                <img src={product.image} alt="" className="product-img" />
                <h6 className="product-name">{product.name}</h6>
                <h6 className="product-price">{product.price}</h6>
              </div>
            </Link>
          </Col>
        ))}
      </Row>


        <Pagination className="custom-pagination pagination-container">
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => paginate(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
      </div>
    </div>
  );
};

export default Categoryproducts;
