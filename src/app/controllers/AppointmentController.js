import { isBefore, format, parseISO, startOfDay, endOfDay } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';
import Schedule from '../models/Schedule';
import Queue from '../../lib/Queue';
import SuccessAppointmentMail from '../jobs/SuccessAppointmentMail';

const AppointmentController = {
  async store(req, res) {
    try {
      const { name, cpf, date, email, phone } = req.body;

      const parsedDate = parseISO(date);

      const user = await User.findOne({ where: { cpf } });

      // Create if user not exists
      if (!user) {
        User.create(req.body);
      } else {
        // Check if user needs to update
        if (user && user.name !== name) {
          user.update({ name });
        }
        if (user && user.phone !== phone) {
          user.update({ phone });
        }
        if (user && user.email !== email) {
          user.update({ email });
        }
      }

      // Check if is past date
      if (isBefore(parsedDate, new Date())) {
        return res
          .status(400)
          .json({ error: 'Não é permitido agendar para uma data passada.' });
      }

      // Check if hour is valid
      let schedules = await Schedule.findAll();
      schedules = schedules.map((s) => s.schedule);

      const hour = format(parsedDate, 'HH:mm', { locale: pt });

      if (!schedules.includes(hour)) {
        return res.status(400).json({ error: 'Horário inválido.' });
      }

      /*
       * Check availability
       * Because only four appointments are available per hour
       */
      const sameTime = await Appointment.findAll({
        where: {
          canceledAt: null,
          date: parsedDate,
        },
      });

      if (sameTime.length > 3) {
        return res.status(400).json({ error: 'Horário indisponível.' });
      }

      await Appointment.create(req.body);

      // Send email to user
      await Queue.add(SuccessAppointmentMail.key, {
        user,
        date,
      });

      return res
        .status(201)
        .json({ date: format(parsedDate, 'dd/MM', { locale: pt }), hour });
    } catch (err) {
      return res.status(500).json({
        error: 'Ocorreu um erro, aguarde um momento e tente novamente.',
      });
    }
  },

  async index(_, res) {
    const appointments = await Appointment.findAll({
      where: { canceled_at: null, concluded_by: null },
      order: ['date'],
      attributes: ['id', 'cpf', 'services', 'docNumber', 'date'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'phone', 'email'],
        },
      ],
    });

    const formattedAppointmets = appointments.map((a) => {
      return {
        ...a.dataValues,
        date: format(a.date, 'dd/MM/yyyy', { locale: pt }),
        hour: format(a.date, 'HH:mm', { locale: pt }),
      };
    });

    return res.json(formattedAppointmets);
  },
};

export default AppointmentController;
