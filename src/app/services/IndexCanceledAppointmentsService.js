import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';
import AdminUser from '../models/AdminUser';
import {
  formatDatetoStringDatetime,
  getDateAndHourFromDatetime,
} from '../utils/date';

class IndexCanceledAppointmentsService {
  async run({ page = 1, perPage = 40 }) {
    const appointments = await Appointment.findAll({
      where: { canceledAt: { [Op.not]: null } },
      attributes: ['id', 'cpf', 'services', 'docNumber', 'canceledAt', 'date'],
      limit: perPage,
      offset: (page - 1) * perPage,
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

    const count = await Appointment.count({
      where: { canceledAt: { [Op.not]: null } },
    });
    const pages = Math.ceil(count / perPage);

    appointments.forEach(appointment => {
      // If canceledBy field is null, so its canceled by user
      if (!appointment.canceledBy) {
        appointment.setDataValue('canceledBy', { name: 'Usuário' });
      }

      const canceledAt = formatDatetoStringDatetime(appointment.canceledAt);
      const { date, hour } = getDateAndHourFromDatetime(appointment.date);

      appointment.setDataValue('date', date);
      appointment.setDataValue('hour', hour);
      appointment.setDataValue('canceledAt', canceledAt);
    });

    return { appointments, pages, count };
  }
}

export default new IndexCanceledAppointmentsService();
