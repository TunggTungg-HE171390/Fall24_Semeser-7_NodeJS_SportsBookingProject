import authorizedAxiosInstance from "./authorizedAxios";

class PostAPI {
  // Create post
  static async createPost(postData, userId, userRole) {
    console.log("userId: ", userId), console.log("Post Data: ", postData);
    try {
      // Ensure postData is a FormData object if necessary.
      if (!(postData instanceof FormData)) {
        const formData = new FormData();
        Object.keys(postData).forEach((key) => {
          formData.append(key, postData[key]);
        });
        postData = formData;
      }
      const res = await authorizedAxiosInstance.post(
        `/post/${userId}`,
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
      const res = await authorizedAxiosInstance.get(`/post/`);
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

  // Get posts by owner
  static async getPostsByOwner(ownerId) {
    try {
      const res = await authorizedAxiosInstance.get(`/post/owner/${ownerId}`);
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

  // Edit post: cái này chưa sửa
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
        `/post/${ownerId}/${postId}`,
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

  static async deletePost(postId, userId, userRole) {
    try {
      const res = await authorizedAxiosInstance.delete(
        `/post/${postId}?userId=${userId}`
      );
      return res.data.result;
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

  static async getPostsPending() {
    try {
      const res = await authorizedAxiosInstance.get(`/post/get-pending`);
      return res.data.result;
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

  static async updateStatusOfPosts(postIds, userId, newStatus) {
    try {
      const res = await authorizedAxiosInstance.put(`/post/update-status`, {
        postIds: Array.from(postIds),
        userId: userId,
        newStatus: newStatus,
      });

      return res.data;
    } catch (error) {
      throw new Error(`Failed to ${newStatus} posts: ${error.message}`);
    }
  }
}

export default PostAPI;
