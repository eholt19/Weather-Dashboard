import { Router } from 'express';
import weatherRoutes from './api/weatherRoutes.js';
import htmlRoutes from './htmlRoutes.js';

const router = Router();

router.use('/api/weather', weatherRoutes);
router.use('/', htmlRoutes);

export default router;
