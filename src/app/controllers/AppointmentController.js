import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import CreateAppointmentService from '../services/CreateAppointmentService';
import ListAppointmentsService from '../services/ListAppointmentsService';
import CancelAppointmentService from '../services/CancelAppointmentService';

const AppointmentController = {
  async store(req, res) {
    try {
      const date = await CreateAppointmentService.run(req.body);

      return res.status(201).json({
        date: format(date, 'dd/MM', { locale: pt }),
        hour: format(date, 'HH:mm', { locale: pt }),
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async index(_, res) {
    const appointments = await ListAppointmentsService.run();

    return res.json(appointments);
  },

  // Appointment canceled by AdminUser
  async update(req, res) {
    try {
      await CancelAppointmentService.run({
        id: req.params.id,
        adminUserId: req.userId,
      });
      return res.status(200).json();
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },
};

export default AppointmentController;
