import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { ObjectType, Field } from 'type-graphql';
import * as argon2 from 'argon2';
import Donation from '../donation/donation';
import ActivityEntry from '../activity-entry/activity-entry';

@Entity()
@ObjectType()
export default class User extends BaseEntity {
  @BeforeInsert()
  protected async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  @Field({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn()
  @Field({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string;

  @Column({
    unique: true,
    transformer: {
      // Null when a left join finds no user, e.g. a donation of a deleted account
      from(value: string | null) {
        return value?.toLowerCase();
      },
      to(value: string) {
        return value.toLowerCase();
      },
    },
  })
  @IsEmail()
  @Field()
  email: string;

  // Not exposed in GraphQL: the hash must never leave the server.
  @Column()
  password: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  picture?: string;

  @Field(() => [Donation], { nullable: true })
  @OneToMany(() => Donation, (donation) => donation.user)
  donations?: Donation[];

  @Field(() => [ActivityEntry], { nullable: true })
  @OneToMany(() => ActivityEntry, (activityEntry) => activityEntry.user)
  activityEntries?: ActivityEntry[];
}
