/* eslint-disable no-plusplus */
import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { Between, In, LessThanOrEqual, ILike, MoreThanOrEqual } from 'typeorm';
import { GraphQLError } from 'graphql';
import { validate } from 'class-validator';
import ActivityEntry from '../../entities/activity-entry/activity-entry';
import InputCreate from '../../entities/activity-entry/input-create';
import InputUpdate from '../../entities/activity-entry/input-update';
import { MyContext } from '../..';
import { SumByCategory, SumByMonth } from './utils';
import { FilterWhereConditions } from './filterWhereConditions';

@Resolver(ActivityEntry)
export default class ActivityEntryResolver {
  @Authorized()
  @Query(() => [ActivityEntry])
  async activityEntries(
    @Ctx() ctx: MyContext,
    @Arg('categoryId', () => Int, { nullable: true }) categoryId?: number,
    @Arg('name', { nullable: true }) name?: string,
  ) {
    if (!ctx.user) {
      throw new Error('You must be authenticated to access activities.');
    }
    return ActivityEntry.find({
      relations: { category: true, user: true },
      where: {
        name: name ? ILike(`%${name}%`) : undefined,
        category: {
          id: categoryId,
        },
        user: {
          id: ctx.user?.id,
        },
      },
    });
  }

  @Authorized()
  @Query(() => [ActivityEntry])
  async filteredActivityEntries(
    @Ctx() ctx: MyContext,
    @Arg('searchTerm', { nullable: true }) searchTerm?: string,
    @Arg('dateFrom', () => Date, { nullable: true }) dateFrom?: Date,
    @Arg('dateTo', () => Date, { nullable: true }) dateTo?: Date,
    @Arg('categoryIds', () => [Int], { nullable: true }) categoryIds?: number[],
    @Arg('skip', () => Int, { defaultValue: 0 }) skip = 0,
    @Arg('take', () => Int, { defaultValue: 15 }) take = 15,
  ): Promise<ActivityEntry[]> {
    if (!ctx.user) {
      throw new Error('You must be authenticated to access activities.');
    }

    const whereConditions: FilterWhereConditions = {
      user: { id: ctx.user.id },
    };

    if (searchTerm) {
      whereConditions.name = ILike(`%${searchTerm}%`);
    }

    if (dateFrom && dateTo) {
      whereConditions.spendedAt = Between(dateFrom, dateTo);
    } else if (dateFrom) {
      whereConditions.spendedAt = MoreThanOrEqual(dateFrom);
    } else if (dateTo) {
      whereConditions.spendedAt = LessThanOrEqual(dateTo);
    }

    if (categoryIds) {
      whereConditions.category = { id: In(categoryIds) };
    }

    return ActivityEntry.find({
      relations: { category: true, user: true },
      where: whereConditions,
      order: {
        spendedAt: 'DESC',
      },
      skip,
      take,
    });
  }

  @Authorized()
  @Query(() => [SumByCategory])
  async getSumByCategory(@Ctx() ctx: MyContext): Promise<SumByCategory[]> {
    if (!ctx.user) {
      throw new Error('You must be authenticated to access this information.');
    }

    const sumByCategory = await ActivityEntry.createQueryBuilder(
      'activityEntry',
    )
      .leftJoinAndSelect('activityEntry.category', 'category')
      .select('category.name', 'categoryName')
      .addSelect('category.id', 'categoryId')
      .addSelect('SUM(activityEntry.input)', 'sumKgCO2')
      .where('activityEntry.userId = :userId', { userId: ctx.user.id })
      .groupBy('category.id')
      .getRawMany<{
        categoryName: string;
        categoryId: number;
        sumKgCO2: number;
      }>();

    return sumByCategory;
  }

  @Authorized()
  @Query(() => [SumByMonth])
  async getSumByMonth(@Ctx() ctx: MyContext) {
    if (!ctx.user) {
      throw new Error('You must be authenticated to access this information.');
    }
    const currentDate = new Date();

    const twelveMonthsAgo = new Date(currentDate);
    twelveMonthsAgo.setFullYear(currentDate.getFullYear() - 1);

    const sumByMonth = await ActivityEntry.createQueryBuilder('activityEntry')
      .select("DATE_TRUNC('month', activityEntry.spendedAt)", 'month')
      .addSelect('SUM(activityEntry.input)', 'sumKgCO2')
      .where('activityEntry.userId = :userId', { userId: ctx.user.id })
      .andWhere('activityEntry.spendedAt >= :twelveMonthsAgo', {
        twelveMonthsAgo,
      })
      .groupBy("DATE_TRUNC('month', activityEntry.spendedAt)")
      .orderBy("DATE_TRUNC('month', activityEntry.spendedAt)", 'ASC')
      .getRawMany<{ month: Date; sumKgCO2: number | null }>();

    function toMonthYear(date: Date) {
      return date.toLocaleString('fr-FR', { year: 'numeric', month: 'long' });
    }

    const last12MonthsTotals: { month: string; sumKgCO2: number | null }[] = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      last12MonthsTotals.push({
        month: toMonthYear(date),
        sumKgCO2: 0,
      });
    }

    sumByMonth.forEach((entry) => {
      const date = new Date(entry.month);
      const monthEntry = last12MonthsTotals.find(
        (m) => m.month === toMonthYear(date),
      );
      if (monthEntry) {
        monthEntry.sumKgCO2 = entry.sumKgCO2 ?? 0;
      }
    });
    return last12MonthsTotals.reverse();
  }

  @Authorized()
  @Query(() => ActivityEntry)
  async getActivityEntryById(
    @Ctx() ctx: MyContext,
    @Arg('activityEntryId', () => Int) id: number,
  ) {
    if (!ctx.user) {
      throw new Error('You must be authenticated to access activities.');
    }
    const activityEntry = await ActivityEntry.findOne({
      where: { id },
      relations: { category: true, user: true },
    });
    if (!activityEntry) throw new GraphQLError('This activity does not exist.');
    return activityEntry;
  }

  @Authorized()
  @Mutation(() => ActivityEntry)
  async createActivityEntry(
    @Ctx() ctx: MyContext,
    @Arg('data', { validate: true }) data: InputCreate,
  ) {
    const newActivityEntry = new ActivityEntry();
    if (!ctx.user) {
      throw new Error('You must be authenticated to create an activity.');
    }
    Object.assign(newActivityEntry, data);
    newActivityEntry.user = ctx.user;
    const errors = await validate(newActivityEntry);
    if (errors.length !== 0)
      throw new GraphQLError('Invalid data', { extensions: { errors } });
    const { id } = await newActivityEntry.save();
    return ActivityEntry.findOne({
      where: { id },
      relations: { category: true, user: true },
    });
  }

  @Authorized()
  @Mutation(() => ActivityEntry)
  async updateActivityEntry(
    @Ctx() ctx: MyContext,
    @Arg('activityEntryId') id: number,
    @Arg('data', { validate: true }) data: InputUpdate,
  ) {
    const activityEntryToUpdate = await ActivityEntry.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!activityEntryToUpdate)
      throw new GraphQLError('This activity does not exist.');
    if (!ctx.user) {
      throw new Error('You must be authenticated to create an activity.');
    }
    if (activityEntryToUpdate.user.id !== ctx.user.id) {
      throw new Error('You are not authorized to update this activity.');
    }
    Object.assign(activityEntryToUpdate, data);
    const errors = await validate(activityEntryToUpdate);
    if (errors.length !== 0)
      throw new GraphQLError('Invalid data', { extensions: { errors } });
    await activityEntryToUpdate.save();
    return ActivityEntry.findOne({
      where: { id },
      relations: { category: true, user: true },
    });
  }

  @Authorized()
  @Mutation(() => String)
  async deleteActivityEntry(
    @Ctx() ctx: MyContext,
    @Arg('activityEntryId') id: number,
  ) {
    const activityEntryToDelete = await ActivityEntry.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!activityEntryToDelete)
      throw new GraphQLError('This activity does not exist.');
    if (!ctx.user) {
      throw new Error('You must be authenticated to create an activity.');
    }
    if (activityEntryToDelete.user.id !== ctx.user.id) {
      throw new Error('You are not authorized to delete this activity.');
    }
    await activityEntryToDelete.remove();
    return 'Activity entry deleted';
  }
}
