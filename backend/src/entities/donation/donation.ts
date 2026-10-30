import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../user/user';

@Entity()
@ObjectType()
export default class Donation extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Column()
  @Field()
  amount: number;

  @Column({ default: false })
  @Field(() => Boolean)
  isAnonymous: boolean;

  // Not exposed in GraphQL: donations are public, see donorName in the resolver.
  // Null once the donor deleted their account: the pot keeps the amount.
  @ManyToOne(() => User, (user) => user.donations, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: User | null;
}
