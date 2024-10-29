import authorizedAxiosInstance from "./authorizedAxios";
import { REACT_APP_IP_Address } from "@env";

class PostAPI {
  // Create post
  static async createPost(postData) {
    try {
      // Ensure postData is a FormData object if necessary.
      if (!(postData instanceof FormData)) {
        const formData = new FormData();
        Object.keys(postData).forEach((key) => {
          formData.append(key, postData[key]);
        });
        postData = formData;
      }

      const ownerId = "670b420e1a81fd665035b288";

      const res = await authorizedAxiosInstance.post(
        `${REACT_APP_IP_Address}/post/${ownerId}`,
        postData
      );

      return res.data;
    } catch (err) {
      if (err.response) {
        throw new Error(err.response.data.message || "Failed to create post.");
      } else if (err.request) {
        throw new Error("No response received from the server.");
      } else {
        throw new Error("Error creating the post: " + err.message);
      }
    }
  }

  // Get all posts
  static async getAllPosts() {
    try {
      const res = await authorizedAxiosInstance.get(
        `${REACT_APP_IP_Address}/post/`
      );
      return res.data.result;
    } catch (err) {
      if (err.response) {
        throw new Error(err.response.data.message || "Failed to fetch posts.");
      } else if (err.request) {
        throw new Error("No response received from the server.");
      } else {
        throw new Error("Error fetching posts: " + err.message);
      }
    }
  }

  // Edit post
  static async editPost(postData, postId) {
    console.log("Extracted postData.id:", postId);
    try {
      if (!(postData instanceof FormData)) {
        const formData = new FormData();
        Object.keys(postData).forEach((key) => {
          formData.append(key, postData[key]);
        });
        postData = formData;
      }

      const ownerId = "670b420e1a81fd665035b288";

      const res = await authorizedAxiosInstance.put(
        `${REACT_APP_IP_Address}/post/${ownerId}/${postId}`,
        postData
      );

      return res.data;
    } catch (err) {
      if (err.response) {
        throw new Error(err.response.data.message || "Failed to edit post.");
      } else if (err.request) {
        throw new Error("No response received from the server.");
      } else {
        throw new Error("Error creating the post: " + err.message);
      }
    }
  }

  static async deletePost(postId) {
    try {
      const res = await authorizedAxiosInstance.delete(
        `${REACT_APP_IP_Address}/post/${postId}`
      );
      if (res.status === 200) {
        console.log("Post successfully marked as deleted:", res.data.result);
        return res.data.result;
      }
    } catch (err) {
      if (err.response) {
        throw new Error(err.response.data.message || "Failed to delete post.");
      } else if (err.request) {
        throw new Error("No response received from the server.");
      } else {
        throw new Error("Error deleting the post: " + err.message);
      }
    }
  }
}

export default PostAPI;
