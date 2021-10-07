import { Router } from 'express';

import AppointmentController from '../controllers/AppointmentController';
import ScheduleController from '../controllers/ScheduleController';
import CanceledAppointmentController from '../controllers/CanceledAppointmentController';
import ConcludedAppointmentController from '../controllers/ConcludedAppointmentController';
import HolidayController from '../controllers/HolidayController';

import AuthUser from '../middlewares/AuthUser';

const routes = Router();

routes.use(AuthUser);

routes.get('/holidays', HolidayController.index);

routes.get('/schedule', ScheduleController.index);

routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', CanceledAppointmentController.store);
routes.put('/appointments/:id/conclude', ConcludedAppointmentController.store);

routes.get('/canceledAppointments', CanceledAppointmentController.index);

routes.get('/concludedAppointments', ConcludedAppointmentController.index);

export default routes;
