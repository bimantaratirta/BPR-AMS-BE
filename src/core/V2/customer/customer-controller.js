// customer-controller.js
import {
  createdResponse,
  successResponse,
  updatedResponse,
} from "../../../utils/response.js";
import customerService from "./customer-service.js";
import CustomerService from "./customer-service.js";

class CustomerController {
  // GET /customers?q=&page=&per_page=&order_by=&order=&status=
  async list(req, res) {
    const unitId = req.user.id; // scope by creator
    const query = req.query;
    const result = await CustomerService.list({ unitId, query });

    return successResponse(
      res,
      result.data,
      "customer retrieved successfully",
      result.meta
    );
  }

  async listCustomerByLo(req, res) {
    const query = req.query;
    const result = await CustomerService.listCustomerByLo(req.params.id, {
      query,
    });

    return successResponse(
      res,
      result.data,
      "customer retrieved successfully",
      result.meta
    );
  }

  // GET /customers/:id
  async detail(req, res) {
    const result = await CustomerService.detail(req.params.id);
    return successResponse(res, result, "Customer retrieved successfully");
  }

  // DELETE /customers/:id
  async remove(req, res) {
    await CustomerService.remove(req.params.id);
    return successResponse(res, null, "Customer deleted successfully");
  }

  // (Opsional) jika Anda juga sudah punya create/update/submit:
  // POST /customers
  async create(req, res) {
    const result = await CustomerService.create(req.body, req.user);
    return createdResponse(res, result, "Customer created successfully");
  }

  // PUT /customers/:id
  async update(req, res) {
    const result = await CustomerService.update(req.params.id, req.body);
    return updatedResponse(res, result);
  }
}

export default new CustomerController();
