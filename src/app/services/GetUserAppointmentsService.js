import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';

class GetUserAppointmentsService {
  async run({ cpf }) {
    const appointments = await Appointment.findAll({
      where: { cpf },
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

    return formattedAppointmets;
  }
}

export default new GetUserAppointmentsService();
