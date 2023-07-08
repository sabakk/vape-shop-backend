import { Request, Response } from 'express';
import { Reset } from '../entity/reset.entity';
import { User } from '../entity/user.entity';
import bcryptjs from 'bcryptjs';
import { sendEmail } from '../utility/email';

export const ForgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const token = Math.random().toString(20).substring(2, 12);

  const reset = await Reset.create({ email, token });
  await reset.save();

  sendEmail(process.env.AWS_SES_EMAIL_SENDER, token);

  res.send({
    message: 'Please check your email!',
  });
};

export const ResetPassword = async (req: Request, res: Response) => {
  const { token, password, password_confirm } = req.body;

  if (password !== password_confirm) {
    return res.status(400).send({
      message: "Password's do not match!",
    });
  }
  const resetPassword = await Reset.findOneBy({ token });
  console.log(resetPassword);
  if (!resetPassword) {
    return res.status(400).send({
      message: 'Invalid link!',
    });
  }
  const user = await User.findOneBy({ email: resetPassword.email });

  if (!user) {
    return res.status(404).send({
      message: 'User not found!',
    });
  }
  await User.update(user.id, {
    password: await bcryptjs.hash(password, 12),
  });

  res.send({
    message: 'success',
  });
};
