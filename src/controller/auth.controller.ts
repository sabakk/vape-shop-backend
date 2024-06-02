import { Request, Response } from 'express';
import { MoreThanOrEqual } from 'typeorm';
import bcryptjs from 'bcryptjs';
import { User } from '../entity/user.entity';
import { sign, verify } from 'jsonwebtoken';
import { Token } from '../entity/token.entity';
import { AppDataSource } from '../data-source';

export const Register = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password, password_confirm } =
      req.body;

    if (password !== password_confirm) {
      return res.status(400).send({
        message: "Password's do not match!",
      });
    }
    const oldEmail = await User.findOneBy({ email: email });
    if (oldEmail) {
      return res.status(400).send({
        message: 'Email already exist',
      });
    }

    const hash = await bcryptjs.hashSync(password, 8);

    const user = User.create({
      first_name,
      last_name,
      email,
      password: hash,
    });
    await user.save();

    const refreshToken = sign(
      { id: user.id },
      process.env.REFRESH_SECRET || "secret",
      { expiresIn: '1w' }
    );
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });

    const expired_at = new Date();
    expired_at.setDate(expired_at.getDate() + 7);

    const token = await Token.create({
      user_id: user.id,
      token: refreshToken,
      expired_at,
    });
    await token.save();

    const accessToken = sign({ id: user.id }, process.env.ACCESS_SECRET || 'secret', {
      expiresIn: '30s',
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...data } = user;

    res.send({
      token: accessToken,
      user: data,
    });
  } catch (e) {
    return res.status(400).send({
      message: 'error',
    });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const user = await User.findOneBy({ email: body.email });
    if (!user) {
      return res.status(400).send({
        message: 'Invalid credentials',
      });
    }

    if (!(await bcryptjs.compare(body.password, user.password))) {
      return res.status(400).send({
        message: 'Invalid credentials',
      });
    }

    const refreshToken = sign(
      { id: user.id },
      process.env.REFRESH_SECRET || 'secret',
      { expiresIn: '1w' }
    );

    const expired_at = new Date();
    expired_at.setDate(expired_at.getDate() + 7);

    const token = await Token.create({
      user_id: user.id,
      token: refreshToken,
      expired_at,
    });
    await token.save();

    const accessToken = sign({ id: user.id }, process.env.ACCESS_SECRET || 'secret', {
      expiresIn: '30s',
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...data } = user;

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });
    res.send({
      token: accessToken,
      user: data,
    });
  } catch (e) {
    return res.status(401).send({
      message: 'unauthenticated',
    });
  }
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
  try {
    const accessToken = req.header('Authorization')?.split(' ')[1] || '';

    const payload: any = verify(accessToken, process.env.ACCESS_SECRET || 'secret');

    if (!payload) {
      return res.status(401).send({
        message: 'unauthenticated',
      });
    }

    const user = await User.findOneBy({ id: parseInt(payload.id) });

    if (!user) {
      return res.status(401).send({
        message: 'unauthenticated',
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...data } = user;

    res.send(data);
  } catch (e) {
    return res.status(401).send({
      message: e,
    });
  }
};

export const Refresh = async (req: Request, res: Response) => {
  try {
    const cookie = req.cookies['refresh_token'];

    const payload: any = verify(cookie, process.env.REFRESH_SECRET || 'secret');

    if (!payload) {
      return res.status(401).send({
        message: 'unauthenticated',
      });
    }
    const tockenRepository = AppDataSource.getRepository(Token);
    const refreshToken = await tockenRepository.findOneBy({
      user_id: payload.id,
      expired_at: MoreThanOrEqual(new Date()),
    });

    if (!refreshToken) {
      return res.status(401).send({
        message: 'unauthenticated',
      });
    }

    const token = sign(
      {
        id: payload.id,
      },
      process.env.ACCESS_SECRET || 'secret',
      { expiresIn: '30s' }
    );

    res.send({
      token,
    });
  } catch (e) {
    return res.status(401).send({
      message: 'unauthenticated',
    });
  }
};

export const Logout = async (req: Request, res: Response) => {
  const tockenRepository = AppDataSource.getRepository(Token);
  const tockenToRemove = await tockenRepository.findOneBy({
    token: req.cookies['refresh_token'],
  });
  await tockenRepository.remove(tockenToRemove);

  res.cookie('refresh_token', '', { maxAge: 0 });

  res.send({
    message: 'success',
  });
};
