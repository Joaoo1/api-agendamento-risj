import Appointment from '../models/Appointment';
import { getDateAndHourFromDatetime } from '../utils/date';

class IndexUserAppointmentsService {
  async run({ cpf }) {
    const appointments = await Appointment.findAll({
      where: { cpf },
      order: [
        ['canceled_at', 'DESC'],
        ['date', 'DESC'],
      ],
    });

    const formattedAppointmets = appointments.map(a => {
      let status;

      if (a.canceledAt) {
        status = 'Cancelado';
      } else if (a.concludedBy) {
        status = 'Atendido';
      } else {
        status = 'Em aberto';
      }

      const { date, hour } = getDateAndHourFromDatetime(a.date);

      return {
        id: a.id,
        cpf: a.cpf,
        status,
        date,
        hour,
      };
    });

    return formattedAppointmets;
  }
}

export default new IndexUserAppointmentsService();
