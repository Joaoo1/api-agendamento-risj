import Schedule from '../models/Schedule';

const ScheduleController = {
  async store(req, res) {
    try {
      if (req.body.schedule.length > 5) {
        return res.status(400).json({ error: 'Horário inválido' });
      }

      // Check for invalid minutes
      const [, minutes] = req.body.schedule.split(':');
      if (parseInt(minutes, 10) > 59) {
        return res
          .status(400)
          .json({ error: 'Minutos não pode ser maior que 59' });
      }

      const scheduleAlreadyExists = await Schedule.findOne({
        where: { schedule: req.body.schedule },
      });

      if (scheduleAlreadyExists) {
        return res.status(400).json({ error: 'Horário já cadastrado' });
      }

      await Schedule.create({ schedule: req.body.schedule });

      return res.status(201).json();
    } catch (err) {
      return res.status(500).json({
        error: 'Ocorreu um erro, aguarde um momento e tente novamente.',
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
