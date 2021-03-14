import Schedule from '../models/Schedule';
import StoreScheduleService from '../services/StoreScheduleService';

const ScheduleController = {
  async store(req, res) {
    try {
      await StoreScheduleService.run({ schedule: req.body.schedule });

      return res.status(201).json();
    } catch (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
  },

  async index(_, res) {
    let schedule = await Schedule.findAll({ order: [['schedule']] });

    schedule = schedule.map((s) => ({ id: s.id, schedule: s.schedule }));

    return res.json(schedule);
  },

  async delete(req, res) {
    try {
      const schedule = await Schedule.findByPk(req.params.id);
      await schedule.destroy();

      return res.status(204).json();
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'Ocorreu um erro ao excluir horário' });
    }
  },
};

export default ScheduleController;
