import { Router } from 'express';

import StoreAppointmentValidator from '../validators/StoreAppointmentValidator';
import IndexAvailableScheduleValidator from '../validators/IndexAvailableScheduleValidator';
import IndexUserAppointmentsValidator from '../validators/IndexUserAppointmentValidator';
import ShowUserValidator from '../validators/ShowUserValidator';
import StoreSessionValidator from '../validators/StoreSessionValidator';

import AppointmentController from '../controllers/AppointmentController';
import AvailableScheduleController from '../controllers/AvailableScheduleController';
import UserAppointmentController from '../controllers/UserAppointmentController';
import UserController from '../controllers/UserController';
import SessionController from '../controllers/SessionController';

const routes = Router();

routes.post('/auth', StoreSessionValidator, SessionController.store);

routes.post(
  '/appointments',
  StoreAppointmentValidator,
  AppointmentController.store
);

routes.get(
  '/schedules/available',
  IndexAvailableScheduleValidator,
  AvailableScheduleController.index
);

routes.put('/appointments/:id/cancel', UserAppointmentController.destroy);
routes.get(
  '/user/:cpf/appointments',
  IndexUserAppointmentsValidator,
  UserAppointmentController.index
);

routes.get('/user/:cpf', ShowUserValidator, UserController.show);

export default routes;
