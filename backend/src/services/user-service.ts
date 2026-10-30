import { isEmail } from 'class-validator';
import { db } from '../db';
import InputRegister from '../entities/user/input-register';
import User from '../entities/user/user';
import ProfileStats from '../entities/user/profile-stats';
import ActivityEntry from '../entities/activity-entry/activity-entry';
import Donation from '../entities/donation/donation';

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

  static async getProfileStats(userId: string): Promise<ProfileStats> {
    const activities = await db
      .getRepository(ActivityEntry)
      .createQueryBuilder('activityEntry')
      .select('COALESCE(SUM(activityEntry.input), 0)', 'totalKgCO2')
      .addSelect('COUNT(*)', 'activityCount')
      .where('activityEntry.userId = :userId', { userId })
      .getRawOne();

    const donations = await db
      .getRepository(Donation)
      .createQueryBuilder('donation')
      .select('COALESCE(SUM(donation.amount), 0)', 'totalDonated')
      .where('donation.userId = :userId', { userId })
      .getRawOne();

    // PostgreSQL returns COUNT and SUM of integers as strings
    return {
      totalKgCO2: Number(activities.totalKgCO2),
      activityCount: Number(activities.activityCount),
      totalDonated: Number(donations.totalDonated),
    };
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
