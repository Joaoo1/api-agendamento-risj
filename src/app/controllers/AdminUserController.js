import StoreAdminUserService from '../services/StoreAdminUserService';

const AvailableController = {
  async store(req, res) {
    try {
      const { name, login } = await StoreAdminUserService.run(req.body);

      return res.status(201).json({ name, login });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },
};

export default AvailableController;
