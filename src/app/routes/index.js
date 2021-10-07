import { Router } from 'express';

import AdminRoutes from './AdminRoutes';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';

const routes = Router();

routes.use(PublicRoutes);

routes.use(PrivateRoutes);

routes.use('/admin', AdminRoutes);

export default routes;
