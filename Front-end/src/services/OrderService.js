import GenericService from "../services/GenericServices";

class OrderService extends GenericService {
  addOrder = (data) => this.post("orders", data);
  deleteOrder = (_id) => this.delete("orders/" + _id);
  updateOrder = (_id, data) => this.put("orders/" + _id, data);
  getOrders = () => this.get("orders");
  getOrderByUser = (userId) => this.get(`orders/user/${userId}`);
  getSingleOrder = (id) => this.get("orders/" + id);
}

let orderService = new OrderService();
export default orderService;
