import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import Queue from '../../lib/Queue';
import CanceledAppointmentMail from '../jobs/CanceledAppointmentMail';
import User from '../models/User';

const UserAppointmentController = {
  async index(req, res) {
    const appointments = await Appointment.findAll({
      where: { cpf: req.params.cpf },
      order: [
        ['canceled_at', 'DESC'],
        ['date', 'DESC'],
      ],
    });

    const formattedAppointmets = appointments.map((a) => {
      let status;

      if (a.canceledAt) {
        status = 'Cancelado';
      } else if (a.concludedBy) {
        status = 'Atendido';
      } else {
        status = 'Em aberto';
      }

      return {
        id: a.id,
        cpf: a.cpf,
        status,
        date: format(a.date, 'dd/MM/yyyy', { locale: pt }),
        hour: format(a.date, 'HH:mm', { locale: pt }),
      };
    });

    return res.json(formattedAppointmets);
  },

  // Appointment canceled by user
  async update(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
    });

    if (!appointment) {
      return res.status(400).json({ error: 'Agendamento não existe.' });
    }

    if (appointment.canceledAt) {
      return res
        .status(400)
        .json({ error: 'Este agendamento já foi cancelado.' });
    }

    if (appointment.concludedBy) {
      return res
        .status(400)
        .json({ error: 'Este agendamento já foi concluído.' });
    }

    // Send email to user
    await Queue.add(CanceledAppointmentMail.key, { appointment });

    await appointment.update({ canceledAt: Date(), canceledBy: null });

    return res.status(200).json();
  },
};

export default UserAppointmentController;
