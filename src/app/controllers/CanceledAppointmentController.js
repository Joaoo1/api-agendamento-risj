import IndexCanceledAppointmentsService from '../services/IndexCanceledAppointmentsService';
import StoreCanceledAppointmentService from '../services/StoreCanceledAppointmentService';

const CanceledAppointmentController = {
  async index(req, res) {
    const appointments = await IndexCanceledAppointmentsService.run({
      page: req.query.page,
      perPage: req.query.perPage,
    });
    return res.status(200).json(appointments);
  },

  async store(req, res) {
    await StoreCanceledAppointmentService.run({
      appointmentId: req.params.appointmentId,
      adminUserId: req.userId,
    });
    return res.status(201).json();
  },
};

export default CanceledAppointmentController;
