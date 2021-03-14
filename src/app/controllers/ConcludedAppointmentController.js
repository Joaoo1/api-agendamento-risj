import GetConcludedAppointmentsService from '../services/GetConcludedAppointmentsService';
import ConcludeAppointmentService from '../services/ConcludeAppointmentService';

const ConcludedAppointmentController = {
  async index(_, res) {
    const appointmets = await GetConcludedAppointmentsService.run();

    return res.json(appointmets);
  },

  // Conclude the appointment
  async update(req, res) {
    try {
      await ConcludeAppointmentService.run({
        id: req.params.id,
        adminUserId: req.userId,
      });

      return res.status(200).json();
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },
};

export default ConcludedAppointmentController;
