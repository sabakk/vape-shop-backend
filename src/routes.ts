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
import {
  CreateProduct,
  DelateProduct,
  GetProduct,
  Products,
  UpdateProduct,
} from './controller/product.controller';
// import { uploadImage } from './utility/aws-s3';
import { isAdmin, isAuth } from './middleware/auth.middleware';
import { GetAllCategories, CreateCategory, UpdateCategory, GetCategory, DelateCategory } from './controller/category.controller';

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

  router.get('/api/product', isAuth, Products);
  router.post(
    '/api/product',
    // uploadImage.single('image'),
    isAdmin,
    CreateProduct
  );
  router.put(
    '/api/product/:id',
    // uploadImage.single('image'),
    isAdmin,
    UpdateProduct
  );
  router.get('/api/product/:id', isAuth, GetProduct);
  router.delete('/api/product', isAdmin, DelateProduct);

  router.get('/api/category', isAuth, GetAllCategories);
  router.post(
    '/api/category',
    isAdmin,
    CreateCategory
  );
  router.put(
    '/api/category/:id',
    isAdmin,
    UpdateCategory
  );
  router.get('/api/category/:id', isAuth, GetCategory);
  router.delete('/api/category', isAdmin, DelateCategory);
};
