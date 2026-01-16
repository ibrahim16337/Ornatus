import GenericService from "../services/GenericServices";

class ProductsService extends GenericService {
  addProduct = (data) => this.post("products", data);
  deleteProduct = (_id) => this.delete("products/" + _id);
  updateProduct = (_id, data) => this.put("products/" + _id, data);
  getProducts = () => this.get("products");
  getProductsByCategory = (category, sortBy, sortOrder, availability) => {
    const params = { category, sortBy, sortOrder, availability };
    console.log("From the API of Products",params);
    return this.get(`products?category=${category}&sortBy=${sortBy}&sortOrder=${sortOrder}&availability=${availability}`, { params });
  };
  getProductsByStyle = (style, sortBy, sortOrder, availability) => {
    const params = { style, sortBy, sortOrder, availability };
    console.log("From the API of Products",params);
    return this.get(`products?style=${style}&sortBy=${sortBy}&sortOrder=${sortOrder}&availability=${availability}`, { params });
  };
  searchProducts = (searchTerm) => {
    return this.get(`products/search?searchTerm=${searchTerm}`);
  };
  getSingleProduct = (id) => this.get("products/" + id);
  getProductByName = (name) => this.get("products/" + name);
}

let productService = new ProductsService();
export default productService;
