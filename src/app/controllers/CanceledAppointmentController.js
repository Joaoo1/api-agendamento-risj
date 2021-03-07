import * as Yup from 'yup';
import { Op } from 'sequelize';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import User from '../models/User';

const CanceledAppointmentController = {
  async index(_, res) {
    const appointments = await Appointment.findAll({
      where: { canceled_at: { [Op.not]: null } },
      order: [['date', 'DESC']],
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
        id: a.id,
        cpf: a.cpf,
        user: a.user,
        canceledAt: format(a.canceledAt, 'dd/MM/yyyy HH:mm', { locale: pt }),
        date: format(a.date, 'dd/MM/yyyy', { locale: pt }),
        hour: format(a.date, 'HH:mm', { locale: pt }),
      };
    });

    return res.json(formattedAppointmets);
  },

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validação falhou.' });
    }

    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(400).json({ error: 'Agendamento não existe.' });
    }

    if (appointment.conclude) {
      return res
        .status(400)
        .json({ error: 'Este agendamento já foi concluído.' });
    }

    await appointment.update({ conclude: true });

    return res.status(200).json();
  },
};

export default CanceledAppointmentController;
