import { Request, Response, NextFunction } from 'express';
import Message from '../model/Message';


export const createMessage = async (req: Request, res: Response) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json({ data: message });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const updateMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndUpdate(id, req.body, { new: true });

    if (!message) {
      return res.status(404).json({ error: `No message for this id ${id}` });
    }

    res.status(200).json({ data: message });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const allMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find();
    res.status(200).json({ size: messages.length, data: messages });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const getMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: `No Message for this id ${req.params.id}` });
    }
    res.json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ error: `No Message for this id ${id}` });
    }
    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: "delete successfully made" });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
