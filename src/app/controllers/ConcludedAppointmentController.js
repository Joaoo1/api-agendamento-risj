import IndexConcludedAppointmentsService from '../services/IndexConcludedAppointmentsService';
import StoreConcludeAppointmentService from '../services/StoreConcludeAppointmentService';

const ConcludedAppointmentController = {
  async index(req, res) {
    const appointmets = await IndexConcludedAppointmentsService.run({
      page: req.query.page,
      perPage: req.query.perPage,
    });
    return res.status(200).json(appointmets);
  },

  async store(req, res) {
    await StoreConcludeAppointmentService.run({
      appointmentId: req.params.id,
      adminUserId: req.userId,
    });
    return res.status(201).json();
  },
};

export default ConcludedAppointmentController;
