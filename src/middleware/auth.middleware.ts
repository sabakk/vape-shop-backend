import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { User, UserRole } from '../entity/user.entity';

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.header('Authorization')?.split(' ')[1] || '';

    const payload: any = verify(accessToken, process.env.ACCESS_SECRET || '');

    if (!payload) {
      return res.status(401).send({
        message: 'unauthenticated',
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...data } = await User.findOneBy({
      id: parseInt(payload.id),
    });

    req['user'] = data;
    next();
  } catch (e) {
    return res.status(401).send({
      message: 'unauthenticated',
      e,
    });
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.header('Authorization')?.split(' ')[1] || '';

    const payload: any = verify(accessToken, process.env.ACCESS_SECRET || '');

    if (!payload) {
      return res.status(401).send({
        message: 'unauthenticated',
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...data } = await User.findOneBy({
      id: parseInt(payload.id),
    });

    const admin = data.role.includes(UserRole.ADMIN);
    if (!admin) {
      return res.status(403).send({
        message: 'Forbidden: Access is denied',
      });
    }
    req['user'] = data;
    next();
  } catch (e) {
    return res.status(403).send({
      message: 'Forbidden: Access is denied',
    });
  }
};
