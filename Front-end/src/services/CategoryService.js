import GenericService from "../services/GenericServices";
class CategoryService extends GenericService {
  
  addCategory = (data) => this.post("category", data);
  deleteCategory = (_id) => this.delete("category/" + _id);
  updateCategory = (_id, data) => this.put("category/" + _id, data);
  getCategories = () => this.get("category");
  getSingleCategory = (id) => this.get("category/" + id);
}

let categoryService = new CategoryService();
export default categoryService;
