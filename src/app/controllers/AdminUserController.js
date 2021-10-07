import StoreAdminUserService from '../services/StoreAdminUserService';

const AdminUserController = {
  async store(req, res) {
    const { name, login } = await StoreAdminUserService.run(req.body);
    return res.status(201).json({ name, login });
  },
};

export default AdminUserController;
