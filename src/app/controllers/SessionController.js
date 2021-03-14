import StoreSessionService from '../services/StoreSessionService';

const SessionController = {
  async store(req, res) {
    try {
      const { token, name } = await StoreSessionService.run(req.body);

      return res.status(200).json({ token, name });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },
};

export default SessionController;
