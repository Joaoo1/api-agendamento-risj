import Appointment from '../models/Appointment';

class ConcludeAppointmentService {
  async run({ id, adminUserId }) {
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      throw new Error('Agendamento não existe.');
    }

    if (appointment.concludedBy) {
      throw new Error('Este agendamento já foi concluído.');
    }

    if (appointment.canceledAt) {
      throw new Error('Este agendamento está cancelado.');
    }

    // TODO: Why can't use camelCase for concludedBy in update method??
    await appointment.update({ concluded_by: adminUserId });
  }
}

export default new ConcludeAppointmentService();
