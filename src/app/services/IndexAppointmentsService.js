import Appointment from '../models/Appointment';
import User from '../models/User';
import { getDateAndHourFromDatetime } from '../utils/date';

class IndexAppointmentsService {
  async run() {
    const appointments = await Appointment.findAll({
      where: { canceledAt: null, concludedBy: null },
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

    appointments.forEach(appointment => {
      const { date, hour } = getDateAndHourFromDatetime(appointment.date);
      appointment.setDataValue('date', date);
      appointment.setDataValue('hour', hour);
    });

    return appointments;
  }
}

export default new IndexAppointmentsService();
