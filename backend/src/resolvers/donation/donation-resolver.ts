import {
  Resolver,
  Mutation,
  Arg,
  Int,
  Query,
  Ctx,
  Authorized,
  FieldResolver,
  Root,
} from 'type-graphql';
import Donation from '../../entities/donation/donation';
import UserService from '../../services/user-service';
import { db } from '../../db';
import { MyContext } from '../..';

const MY_DONATIONS_LIMIT = 5;

@Resolver(Donation)
export default class DonationResolver {
  @FieldResolver(() => String, { nullable: true })
  donorName(@Root() donation: Donation): string | null {
    if (donation.isAnonymous) return null;
    return donation.user?.name ?? null;
  }

  @Mutation(() => Donation)
  async createDonation(
    @Ctx() ctx: MyContext,
    @Arg('amount', () => Int) amount: number,
    @Arg('isAnonymous', () => Boolean, { nullable: true })
    isAnonymous?: boolean,
  ): Promise<Donation> {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new Error('Vous devez être authentifié pour créer une donation!');
    }

    const user = await UserService.readById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const donation = new Donation();
    donation.user = user;
    donation.amount = amount;
    donation.isAnonymous = isAnonymous || false;
    donation.createdAt = new Date();
    await donation.save();
    return donation;
  }

  @Query(() => Int)
  async getPot(): Promise<number> {
    const total = await db
      .getRepository(Donation)
      .createQueryBuilder('donation')
      .select('SUM(donation.amount)', 'total')
      .getRawOne();
    return total.total;
  }

  @Authorized()
  @Query(() => [Donation])
  async getMyDonations(@Ctx() ctx: MyContext): Promise<Donation[]> {
    if (!ctx.user) {
      throw new Error('You must be authenticated to access your donations.');
    }
    return Donation.find({
      where: { user: { id: ctx.user.id } },
      order: { createdAt: 'DESC' },
      take: MY_DONATIONS_LIMIT,
    });
  }

  @Query(() => [Donation])
  async getLastDonations(): Promise<Donation[]> {
    const donations = await Donation.find({
      order: { createdAt: 'DESC' },
      take: 8,
      relations: ['user'],
    });
    return donations;
  }
}
