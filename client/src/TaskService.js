import axios from "axios";

export class TaskService {
  async get() {
    const response = await axios.get("/api/tasks");
    return response.data;
  }

  async updateCompleted(task, completed) {
    await axios.put(`/api/tasks/${task._id}`, { completed: completed });
  }

  async add(task) {
    await axios.post(`/api/tasks`, { action: task });
  }

  async delete(task) {
    await axios.delete(`/api/tasks/${task._id}`);
  }
}
