import Appointment from '../models/Appointment';
import User from '../models/User';
import Queue from '../../lib/Queue';
import CanceledAppointmentMail from '../jobs/CanceledAppointmentMail';

class CancelAppointmentService {
  async run({ id, adminUserId = null }) {
    const appointment = await Appointment.findByPk(id, {
      // include user information to be used on sending email
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
    });

    if (!appointment) {
      throw new Error('Agendamento não existe.');
    }

    if (appointment.concludedBy) {
      throw new Error('Este agendamento já foi concluído.');
    }

    if (appointment.canceledAt) {
      throw new Error('Este agendamento já foi cancelado.');
    }

    // TODO: Why can't use camelCase for canceledBy in update method??
    await appointment.update({ canceledAt: Date(), canceled_by: adminUserId });

    // Send email to user
    await Queue.add(CanceledAppointmentMail.key, { appointment });
  }
}

export default new CancelAppointmentService();
