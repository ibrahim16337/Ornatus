import GenericService from "../services/GenericServices";

class ReviewService extends GenericService {
  addReview = (data) => this.post("reviews", data);
  deleteReview = (_id) => this.delete("reviews/" + _id);
  updateReview = (_id, data) => this.put("reviews/" + _id, data);
  getReviews = () => this.get("reviews");
  getReviewByProduct = (productId) => this.get(`reviews/product/${productId}`);
  getReviewByUser = (userId) => this.get(`reviews/user/${userId}`);
  getSingleReview = (id) => this.get("reviews/" + id);
}

let reviewService = new ReviewService();
export default reviewService;
