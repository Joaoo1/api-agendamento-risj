import { Router } from 'express';

import UserAppointmentController from './app/controllers/UserAppointmentController';
import AppointmentController from './app/controllers/AppointmentController';
import AvailableController from './app/controllers/AvailableController';
import UserController from './app/controllers/UserController';
import ScheduleController from './app/controllers/ScheduleController';
import CanceledAppointmentController from './app/controllers/CanceledAppointmentController';
import SessionController from './app/controllers/SessionController';
import AdminUserController from './app/controllers/AdminUserController';
import ConcludedAppointmentController from './app/controllers/ConcludedAppointmentController';
import authUser from './app/middlewares/authUser';
import authAdmin from './app/middlewares/authAdmin';
import * as validators from './app/validators';

const routes = Router();

routes.post(
  '/appointments',
  validators.AppointmentStore,
  AppointmentController.store
);

routes.get('/available', validators.AvailableIndex, AvailableController.index);

routes.put(
  '/cancel_appointment/:id',
  validators.UserAppointmentUpdate,
  UserAppointmentController.update
);
routes.get(
  '/user_appointments/:cpf',
  validators.UserAppointmentIndex,
  UserAppointmentController.index
);

routes.get('/user/:cpf', validators.UserShow, UserController.show);

routes.post('/admin_session', validators.SessionStore, SessionController.store);

routes.use(authUser);

routes.get('/appointments', AppointmentController.index);
routes.get('/canceled_appointments', CanceledAppointmentController.index);

routes.get('/schedule', ScheduleController.index);

routes.put(
  '/conclude_appointment/:id',
  validators.ConcludedAppointmentUpdate,
  ConcludedAppointmentController.update
);
routes.get('/concluded_appointments', ConcludedAppointmentController.index);

routes.put(
  '/admin_cancel_appointment/:id',
  validators.CanceledAppointmentUpdate,
  CanceledAppointmentController.update
);

routes.use(authAdmin);

routes.post('/schedule', validators.ScheduleStore, ScheduleController.store);
routes.delete(
  '/schedule/:id',
  validators.ScheduleDelete,
  ScheduleController.delete
);

routes.post(
  '/admin_user',
  validators.AdminUserStore,
  AdminUserController.store
);

export default routes;
