import ListCanceledAppointmentsService from '../services/ListCanceledAppointmentsService';

const CanceledAppointmentController = {
  async index(req, res) {
    const appointments = await ListCanceledAppointmentsService.run({
      page: req.query.page,
    });

    return res.json(appointments);
  },
};

export default CanceledAppointmentController;
