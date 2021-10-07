import Appointment from '../models/Appointment';
import AppError from '../errors/AppError';

class StoreConcludeAppointmentService {
  async run({ appointmentId, adminUserId }) {
    const appointment = await Appointment.findByPk(appointmentId);

    if (!appointment) {
      throw new AppError(404, 'Agendamento não existe.');
    }

    if (appointment.concludedBy) {
      throw new AppError(403, 'Este agendamento já foi concluído.');
    }

    if (appointment.canceledAt) {
      throw new AppError(403, 'Este agendamento está cancelado.');
    }

    await appointment.update({ concluded_by: adminUserId });
  }
}

export default new StoreConcludeAppointmentService();
