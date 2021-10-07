import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';
import AdminUser from '../models/AdminUser';
import { getDateAndHourFromDatetime } from '../utils/date';

class IndexConcludedAppointmentsService {
  async run({ page = 1, perPage = 40 }) {
    const appointments = await Appointment.findAll({
      where: { concludedBy: { [Op.not]: null } },
      order: [['date', 'DESC']],
      attributes: ['id', 'cpf', 'services', 'docNumber', 'date'],
      limit: perPage,
      offset: (page - 1) * perPage,
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

    const count = await Appointment.count({
      where: { concludedBy: { [Op.not]: null } },
    });

    const pages = Math.ceil(count / perPage);

    appointments.forEach(appointment => {
      const { date, hour } = getDateAndHourFromDatetime(appointment.date);

      appointment.setDataValue('date', date);
      appointment.setDataValue('hour', hour);
    });

    return { appointments, pages, count };
  }
}

export default new IndexConcludedAppointmentsService();
