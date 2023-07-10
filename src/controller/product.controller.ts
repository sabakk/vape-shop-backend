import { Request, Response } from 'express';
import { Product } from '../entity/product.entity';
import { deleteImage } from '../utility/aws-s3';

export const CreateProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, price } = req.body;
    const image = req.file?.['location']
      ? req.file?.['location']
      : process.env.DEFAULT_PRODUCT_IMAGE;

    const product = await Product.create({
      title,
      description,
      image,
      price,
    });
    await product.save();

    res.send({
      message: 'image is uploaded',
      product,
    });
  } catch (e) {
    return res.status(400).send({
      message: 'product create error',
      err: e,
    });
  }
};
export const DelateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const product = await Product.findOneBy({
      id,
    });

    const key = product.image.split('com/')[1];
    deleteImage(key);
    await Product.delete(id);

    res.send({
      message: 'image was delated',
    });
  } catch (e) {
    return res.status(400).send({
      message: 'product delate error',
      err: e,
    });
  }
};
