import StoreCanceledAppointmentService from '../services/StoreCanceledAppointmentService';
import IndexUserAppointmentsService from '../services/IndexUserAppointmentsService';

const UserAppointmentController = {
  async index(req, res) {
    const appointments = await IndexUserAppointmentsService.run({
      cpf: req.params.cpf,
    });
    return res.status(200).json(appointments);
  },

  // Appointment canceled by user
  async destroy(req, res) {
    await StoreCanceledAppointmentService.run({
      appointmentId: req.params.appointmentId,
    });
    return res.status(204).json();
  },
};

export default UserAppointmentController;
