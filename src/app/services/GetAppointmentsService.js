import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import User from '../models/User';

class GetAppointmentsService {
  async run() {
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

    return formattedAppointmets;
  }
}

export default new GetAppointmentsService();
