import IndexAvailableSchedulesService from '../services/IndexAvailableSchedulesService';

const AvailableScheduleController = {
  async index(req, res) {
    const available = await IndexAvailableSchedulesService.run({
      date: +req.query.date,
    });
    return res.status(200).json(available);
  },
};

export default AvailableScheduleController;
