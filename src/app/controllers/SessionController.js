import StoreSessionService from '../services/StoreSessionService';

const SessionController = {
  async store(req, res) {
    const { token, name } = await StoreSessionService.run(req.body);
    return res.status(201).json({ token, name });
  },
};

export default SessionController;
