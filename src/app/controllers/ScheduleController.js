import * as Yup from 'yup';
import Schedule from '../models/Schedule';

const ScheduleController = {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        schedule: Yup.string()
          .required('Insira o horário')
          .matches(/^\d{2}:\d{2}/, { message: 'Horário inválido' }),
      });

      try {
        await schema.validate(req.body, { abortEarly: false });
      } catch (err) {
        if (err.name === 'ValidationError') {
          return res.status(400).json({ error: err.errors });
        }

        return res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
      }

      if (req.body.schedule.length > 5) {
        return res.status(400).json({ error: 'Horário inválido' });
      }

      const [, hour] = req.body.schedule.split(':');
      if (parseInt(hour, 10) > 59) {
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
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID Não informado' });
    }

    const schedule = await Schedule.findByPk(id);

    try {
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
