import StoreAppointmentService from '../services/StoreAppointmentService';
import IndexAppointmentsService from '../services/IndexAppointmentsService';
import { getDateAndHourFromDatetime } from '../utils/date';

const AppointmentController = {
  async index(req, res) {
    const appointments = await IndexAppointmentsService.run();
    return res.status(200).json(appointments);
  },

  async store(req, res) {
    const date = await StoreAppointmentService.run(req.body);
    const response = getDateAndHourFromDatetime(date);
    return res.status(201).json(response);
  },
};

export default AppointmentController;
