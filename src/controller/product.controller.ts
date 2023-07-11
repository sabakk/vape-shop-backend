import { Request, Response } from 'express';
import { Product } from '../entity/product.entity';
import { deleteImage } from '../utility/aws-s3';

export const Products = async (req: Request, res: Response) => {
  const take = 15;
  const page = parseInt((req.query.page as string) || '1');

  const [data, total] = await Product.findAndCount({
    take,
    skip: (page - 1) * take,
  });

  res.send({
    data,
    meta: {
      total,
      page,
      last_page: Math.ceil(total / take),
    },
  });
};

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

export const UpdateProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, price } = req.body;
    const image = req.file?.['location']
      ? req.file?.['location']
      : process.env.DEFAULT_PRODUCT_IMAGE;

    const product = await Product.update(
      { id: parseInt(req.params.id) },
      {
        title,
        description,
        image,
        price,
      }
    );

    res.send({
      message: 'product is updated',
      product,
    });
  } catch (e) {
    return res.status(400).send({
      message: 'product update error',
      err: e,
    });
  }
};

export const GetProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOneBy({ id: parseInt(req.params.id) });

    if (!product) {
      return res.status(401).send({
        message: 'product not found',
      });
    }

    res.send(product);
  } catch (e) {
    return res.status(401).send({
      message: e,
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
