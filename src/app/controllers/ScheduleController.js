import StoreScheduleService from '../services/StoreScheduleService';
import IndexSchedulesService from '../services/IndexSchedulesService';
import DestroyScheduleService from '../services/DestroyScheduleService';

const ScheduleController = {
  async index(req, res) {
    const schedules = await IndexSchedulesService.run();
    return res.status(200).json(schedules);
  },

  async store(req, res) {
    await StoreScheduleService.run({ schedule: req.body.schedule });
    return res.status(201).json();
  },

  async destroy(req, res) {
    await DestroyScheduleService.run({ scheduleId: req.params.scheduleId });
    return res.status(204).json();
  },
};

export default ScheduleController;
