import Appointment from '../models/Appointment';
import User from '../models/User';
import AppError from '../errors/AppError';
import Queue from '../../lib/Queue';
import CanceledAppointmentMail from '../jobs/CanceledAppointmentMail';

class StoreCanceledAppointmentService {
  async run({ id, adminUserId = null }) {
    const appointment = await Appointment.findByPk(id, {
      // included user information to be used on sending email
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
    });

    if (!appointment) {
      throw new AppError(404, 'Agendamento não existe.');
    }

    if (appointment.concludedBy) {
      throw new AppError(403, 'Este agendamento já foi concluído.');
    }

    if (appointment.canceledAt) {
      throw new AppError(403, 'Este agendamento já foi cancelado.');
    }

    await appointment.update({ canceledAt: Date(), canceled_by: adminUserId });

    await Queue.add(CanceledAppointmentMail.key, { appointment });
  }
}

export default new StoreCanceledAppointmentService();
