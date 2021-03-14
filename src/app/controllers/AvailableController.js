import AvailableService from '../services/AvailableService';

const AvailableController = {
  async index(req, res) {
    const searchDate = Number(req.query.date);

    const available = await AvailableService.run({ date: searchDate });

    return res.json(available);
  },
};

export default AvailableController;
