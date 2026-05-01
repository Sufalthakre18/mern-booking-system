import { Router } from 'express';
import { getExperts, getExpertById } from '../controllers/expertController.js';

const router = Router();

router.get('/', getExperts);
router.get('/:id', getExpertById);

export default router;