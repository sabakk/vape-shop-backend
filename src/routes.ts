import { Router } from 'express';
import { ForgotPassword, ResetPassword } from './controller/forgot.controller';
import {
  AuthenticatedUser,
  Login,
  Logout,
  Refresh,
  Register,
} from './controller/auth.controller';
import { validate } from 'express-validation';
import {
  ForgotValidation,
  ResetValidation,
} from './validation/reset.validation';
import {
  LoginValidation,
  RegisterValidation,
} from './validation/auth.validation';

export const routes = (router: Router) => {
  router.post('/api/register', validate(RegisterValidation, {}, {}), Register);
  router.post('/api/login', validate(LoginValidation, {}, {}), Login);
  router.get('/api/user', AuthenticatedUser);
  router.post('/api/refresh', Refresh);
  router.post('/api/logout', Logout);
  router.post(
    '/api/forgot',
    validate(ForgotValidation, {}, {}),
    ForgotPassword
  );
  router.post('/api/reset', validate(ResetValidation, {}, {}), ResetPassword);
};
