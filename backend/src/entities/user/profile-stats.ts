import { Field, Float, Int, ObjectType } from 'type-graphql';

@ObjectType()
export default class ProfileStats {
  @Field(() => Float)
  totalKgCO2: number;

  @Field(() => Int)
  activityCount: number;

  @Field(() => Int)
  totalDonated: number;
}
