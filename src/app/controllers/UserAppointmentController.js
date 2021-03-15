import CancelAppointmentService from '../services/CancelAppointmentService';
import ListUserAppointmentsService from '../services/ListUserAppointmentsService';

const UserAppointmentController = {
  async index(req, res) {
    const appointments = await ListUserAppointmentsService.run({
      cpf: req.params.cpf,
    });

    return res.json(appointments);
  },

  // Appointment canceled by user
  async update(req, res) {
    try {
      await CancelAppointmentService.run({
        id: req.params.id,
      });
      return res.status(200).json();
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },
};

export default UserAppointmentController;
