import { Router } from 'express';

import UserAppointment from './app/controllers/UserAppointmentController';
import AppointmentController from './app/controllers/AppointmentController';
import AvailableController from './app/controllers/AvailableController';
import UserController from './app/controllers/UserController';

const routes = Router();

routes.post('/appointments', AppointmentController.store);

routes.get('/available', AvailableController.index);

routes.put('/user_appointments/:id', UserAppointment.update);
routes.get('/user_appointments/:cpf', UserAppointment.index);

routes.get('/user/:cpf', UserController.show);

export default routes;
