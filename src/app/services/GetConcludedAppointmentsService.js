import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';
import AdminUser from '../models/AdminUser';

class GetConcludedAppointmentsService {
  async run() {
    const appointments = await Appointment.findAll({
      where: { concluded_by: { [Op.not]: null } },
      order: [['date', 'DESC']],
      attributes: ['id', 'cpf', 'services', 'docNumber', 'date'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'phone', 'email'],
        },
        {
          model: AdminUser,
          as: 'concludedBy',
          attributes: ['name'],
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

    return formattedAppointmets;
  }
}

export default new GetConcludedAppointmentsService();
