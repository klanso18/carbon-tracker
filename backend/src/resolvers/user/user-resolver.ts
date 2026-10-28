/* eslint-disable no-restricted-syntax */
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import * as argon2 from 'argon2';
import Cookies from 'cookies';
import { SignJWT } from 'jose';
import { GraphQLError } from 'graphql';
import { validate } from 'class-validator';
import { db } from '../../db';
import User from '../../entities/user/user';
import InputRegister from '../../entities/user/input-register';
import UserWithoutPassword from '../../entities/user/user-without-password';
import Message from '../../entities/user/message';
import InputLogin from '../../entities/user/input-login';
import { MyContext } from '../..';
import UserService from '../../services/user-service';

@Resolver(User)
export default class UserResolver {
  @Authorized()
  @Query(() => [User])
  async users() {
    const userRepository = db.getRepository(User);
    return userRepository.find();
  }

  @Query(() => Message)
  async login(@Arg('infos') infos: InputLogin, @Ctx() ctx: MyContext) {
    const user = await UserService.readByMail(infos.email);

    if (!user) {
      throw new Error('Verify your informations');
    }

    const isPasswordValid = await argon2.verify(user.password, infos.password);
    const result = new Message();
    if (isPasswordValid) {
      const token = await new SignJWT({ email: user.email })
        .setProtectedHeader({ alg: 'HS256', typ: 'jwt' })
        .setExpirationTime('2h')
        .sign(new TextEncoder().encode(`${process.env.SECRET_KEY}`));

      const cookies = new Cookies(ctx.req, ctx.res);
      cookies.set('token', token, { httpOnly: true });

      result.message = 'Welcome!';
      result.success = true;
      result.user = user;
    } else {
      result.message = 'Vérifiez vos informations...';
      result.success = false;
    }
    return result;
  }

  @Query(() => Message)
  async logout(@Ctx() ctx: MyContext) {
    if (ctx.user) {
      const cookies = new Cookies(ctx.req, ctx.res);
      cookies.set('token');
    }
    const m = new Message();
    m.message = 'You have been disconnected';
    m.success = true;

    return m;
  }

  @Mutation(() => UserWithoutPassword)
  async register(@Arg('infos') infos: InputRegister) {
    const existingUser = await UserService.readByMail(infos.email);

    if (existingUser) {
      throw new Error('Cette adresse mail est déjà utilisée');
    }

    const newUser = await UserService.create({
      email: infos.email,
      password: infos.password,
    });

    return newUser;
  }

  @Authorized()
  @Mutation(() => User)
  async updateUser(
    @Ctx() ctx: MyContext,
    @Arg('name', { nullable: true }) name?: string,
    @Arg('picture', { nullable: true }) picture?: string,
  ): Promise<User | null> {
    if (!ctx.user) {
      throw new Error(
        'You must be authenticated to update your profile picture.',
      );
    }
    const userToUpdate = await User.findOne({
      where: { id: ctx.user.id },
    });

    if (!userToUpdate) {
      throw new Error('User not found.');
    }

    const data = { picture, name };

    Object.assign(userToUpdate, data);
    console.log(data);
    const errors = await validate(userToUpdate);
    console.log(errors);
    if (errors.length !== 0)
      throw new GraphQLError('Invalid data', { extensions: { errors } });
    await userToUpdate.save();
    return User.findOne({
      where: { id: ctx.user.id },
    });
  }

  @Authorized()
  @Mutation(() => User)
  async changePassword(
    @Ctx() ctx: MyContext,
    @Arg('oldPassword') oldPassword: string,
    @Arg('newPassword') newPassword: string,
  ): Promise<User | null> {
    if (!ctx.user) {
      throw new Error('You must be authenticated to change your password.');
    }

    const user = await User.findOne({
      where: { id: ctx.user.id },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    const validOldPassword = await argon2.verify(user.password, oldPassword);
    if (!validOldPassword) {
      throw new Error('Ancien mot de passe incorrecte.');
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      throw new Error(
        'Le mot de passe doit contenir au moins huit caractères, au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.',
      );
    }

    user.password = await argon2.hash(newPassword);
    await user.save();

    return user;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteUser(
    @Ctx() ctx: MyContext,
    @Arg('password') password: string,
  ): Promise<boolean> {
    if (!ctx.user) {
      throw new Error('You must be authenticated to delete your account.');
    }

    const user = await User.findOne({
      where: { id: ctx.user.id },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      throw new Error('Password is incorrect.');
    }

    await User.remove(user);
    return true;
  }
}
