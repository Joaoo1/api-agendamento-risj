import { Router } from 'express';

import UserAppointmentController from './app/controllers/UserAppointmentController';
import AppointmentController from './app/controllers/AppointmentController';
import AvailableController from './app/controllers/AvailableController';
import UserController from './app/controllers/UserController';
import ScheduleController from './app/controllers/ScheduleController';
import CanceledAppointmentController from './app/controllers/CanceledAppointmentController';
import authAdmin from './app/middlewares/authAdmin';
import SessionController from './app/controllers/SessionController';

const routes = Router();

routes.post('/appointments', AppointmentController.store);

routes.get('/available', AvailableController.index);

routes.put('/cancel_appointment/:id', UserAppointmentController.update);
routes.put('/conclude_appointment/:id', AppointmentController.update);
routes.get('/user_appointments/:cpf', UserAppointmentController.index);

routes.get('/user/:cpf', UserController.show);

routes.post('/admin_session', SessionController.store);

routes.use(authAdmin);

routes.get('/appointments', AppointmentController.index);
routes.get('/canceled_appointments', CanceledAppointmentController.index);
routes.get('/schedule', ScheduleController.index);
routes.post('/schedule', ScheduleController.store);
routes.delete('/schedule/:id', ScheduleController.delete);

export default routes;
