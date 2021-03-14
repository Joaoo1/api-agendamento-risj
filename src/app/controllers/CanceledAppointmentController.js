import GetCanceledAppointmentsService from '../services/GetCanceledAppointmentsService';

const CanceledAppointmentController = {
  async index(_, res) {
    const appointments = await GetCanceledAppointmentsService.run();
    return res.json(appointments);
  },
};

export default CanceledAppointmentController;
