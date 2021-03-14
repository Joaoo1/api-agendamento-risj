import { Op } from 'sequelize';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import User from '../models/User';
import AdminUser from '../models/AdminUser';
import Queue from '../../lib/Queue';
import CanceledAppointmentMail from '../jobs/CanceledAppointmentMail';

const CanceledAppointmentController = {
  async index(_, res) {
    const appointments = await Appointment.findAll({
      where: { canceled_at: { [Op.not]: null } },
      attributes: ['id', 'cpf', 'services', 'docNumber', 'canceledAt', 'date'],
      order: [['date', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'phone', 'email'],
        },
        {
          model: AdminUser,
          as: 'canceledBy',
          attributes: ['name'],
        },
      ],
    });

    const formattedAppointmets = appointments.map((a) => {
      // If canceledBy field is null, so its canceled by user
      if (!a.canceledBy) {
        a.dataValues.canceledBy = { name: 'Usuário' };
      }

      return {
        ...a.dataValues,
        canceledAt: format(a.canceledAt, 'dd/MM/yyyy HH:mm', { locale: pt }),
        date: format(a.date, 'dd/MM/yyyy', { locale: pt }),
        hour: format(a.date, 'HH:mm', { locale: pt }),
      };
    });

    return res.json(formattedAppointmets);
  },

  // Appointment canceled by AdminUser
  async update(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
    });

    if (!appointment) {
      return res.status(400).json({ error: 'Agendamento não existe.' });
    }

    if (appointment.concludedBy) {
      return res
        .status(400)
        .json({ error: 'Este agendamento já foi concluído.' });
    }

    if (appointment.canceledAt) {
      return res
        .status(400)
        .json({ error: 'Este agendamento já foi cancelado.' });
    }

    // Send email to user
    await Queue.add(CanceledAppointmentMail.key, { appointment });

    // TODO: Why can't use camelCase for canceledBy in update method??
    await appointment.update({ canceledAt: Date(), canceled_by: req.userId });

    return res.status(200).json();
  },
};

export default CanceledAppointmentController;
