import { Router } from 'express';

import StoreScheduleValidator from '../validators/StoreScheduleValidator';
import StoreAdminUserValidator from '../validators/StoreAdminUserValidator';
import StoreHolidayValidator from '../validators/StoreHolidayValidator';

import ScheduleController from '../controllers/ScheduleController';
import AdminUserController from '../controllers/AdminUserController';
import HolidayController from '../controllers/HolidayController';

import AuthAdmin from '../middlewares/AuthAdmin';

const routes = Router();

routes.use(AuthAdmin);

routes.post('/schedules', StoreScheduleValidator, ScheduleController.store);
routes.delete('/schedules/:scheduleId', ScheduleController.destroy);

routes.post('/adminUsers', StoreAdminUserValidator, AdminUserController.store);

routes.post('/holidays', StoreHolidayValidator, HolidayController.store);
routes.delete('/holidays/:holidayId', HolidayController.destroy);

export default routes;
