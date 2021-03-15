import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';
import AdminUser from '../models/AdminUser';

class ListCanceledAppointmentsService {
  async run({ page = 1 }) {
    const appointments = await Appointment.findAll({
      where: { canceled_at: { [Op.not]: null } },
      attributes: ['id', 'cpf', 'services', 'docNumber', 'canceledAt', 'date'],
      limit: 40,
      offset: (page - 1) * 40,
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

    return formattedAppointmets;
  }
}

export default new ListCanceledAppointmentsService();
