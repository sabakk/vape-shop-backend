import { Request, Response } from 'express';
import { Category } from '../entity/category.entity';

export const GetAllCategories = async (req: Request, res: Response) => {
  
  const data = await Category.find();

  res.send({
    data,
  });
};

export const CreateCategory = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    
    const category = await Category.create({
      title
    });
    await category.save();

    res.send({
      message: 'category is created',
      category,
    });
  } catch (e) {
    return res.status(400).send({
      message: 'category create error',
      err: e,
    });
  }
};

export const UpdateCategory = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    const category = await Category.update(
      { id: parseInt(req.params.id) },
      {
        title
      }
    );

    res.send({
      message: 'category is updated',
      category,
    });
  } catch (e) {
    return res.status(400).send({
      message: 'category update error',
      err: e,
    });
  }
};

export const GetCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findOneBy({ id: parseInt(req.params.id) });

    if (!category) {
      return res.status(401).send({
        message: 'category not found',
      });
    }

    res.send(category);
  } catch (e) {
    return res.status(401).send({
      message: e,
    });
  }
};

export const DelateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
   
    await Category.delete(id);

    res.send({
      message: 'category was delated',
    });
  } catch (e) {
    return res.status(400).send({
      message: 'category delate error',
      err: e,
    });
  }
};
