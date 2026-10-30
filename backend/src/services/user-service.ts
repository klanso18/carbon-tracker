import { isEmail } from 'class-validator';
import { db } from '../db';
import InputRegister from '../entities/user/input-register';
import User from '../entities/user/user';

// Same rule as frontend/src/pages/auth/signup.tsx: any non-alphanumeric
// character counts as special.
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;

export default class UserService {
  static assertValidEmail(email: string): void {
    if (!isEmail(email)) {
      throw new Error("L'adresse e-mail n'est pas valide.");
    }
  }

  static assertValidPassword(password: string): void {
    if (!PASSWORD_REGEX.test(password)) {
      throw new Error(
        'Le mot de passe doit contenir au moins huit caractères, au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.',
      );
    }
  }

  static assertValidName(name: string): void {
    if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
      throw new Error(
        `Le nom doit contenir entre ${NAME_MIN_LENGTH} et ${NAME_MAX_LENGTH} caractères.`,
      );
    }
  }

  static async readByMail(email: string): Promise<User | null> {
    const userRepository = db.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    return user;
  }

  static async readById(id: string): Promise<User | null> {
    const userRepository = db.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });
    return user;
  }

  static async create(infos: InputRegister): Promise<User> {
    const existingUser = await this.readByMail(infos.email);

    if (existingUser) {
      throw new Error('User with this mail already exist');
    }

    const userRepository = db.getRepository(User);
    const newUser = userRepository.create({
      email: infos.email,
      password: infos.password,
    });

    await userRepository.save(newUser);

    return newUser;
  }
}
