import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import GeneratedPaper from '../models/GeneratedPaper';
import { addAssignmentJob } from '../queues/assignmentQueue';

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { dueDate, questionTypes, additionalInstructions } = req.body;

    const parsedTypes = typeof questionTypes === 'string'
      ? JSON.parse(questionTypes)
      : questionTypes;

    const totalQuestions = parsedTypes.reduce(
      (sum: number, q: any) => sum + q.numberOfQuestions, 0
    );
    const totalMarks = parsedTypes.reduce(
      (sum: number, q: any) => sum + q.numberOfQuestions * q.marksPerQuestion, 0
    );

    const assignment = await Assignment.create({
      dueDate,
      questionTypes: parsedTypes,
      additionalInstructions,
      filePath: req.file?.path,
      totalQuestions,
      totalMarks,
      status: 'pending',
    });

    const jobId = await addAssignmentJob(assignment._id.toString(), {
      questionTypes: parsedTypes,
      additionalInstructions,
    });

    await Assignment.findByIdAndUpdate(assignment._id, { jobId });

    res.status(201).json({
      success: true,
      assignmentId: assignment._id,
      jobId,
      message: 'Assignment created and generation started',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAssignments = async (_req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json({ success: true, assignments });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, error: 'Not found' });
    }
    res.json({ success: true, assignment });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    await GeneratedPaper.deleteMany({ assignmentId: req.params.id });
    res.json({ success: true, message: 'Deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getGeneratedPaper = async (req: Request, res: Response) => {
  try {
    const paper = await GeneratedPaper.findOne({
      assignmentId: req.params.assignmentId,
    });
    if (!paper) {
      return res.status(404).json({ success: false, error: 'Paper not generated yet' });
    }
    res.json({ success: true, paper });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};