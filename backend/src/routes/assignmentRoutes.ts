import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  deleteAssignment,
  getGeneratedPaper,
} from '../controllers/assignmentController';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

const router = Router();

router.post('/', upload.single('file'), createAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignmentById);
router.delete('/:id', deleteAssignment);
router.get('/:assignmentId/paper', getGeneratedPaper);

export default router;