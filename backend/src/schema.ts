import { buildSchema } from 'type-graphql';
import UserResolver from './resolvers/user/user-resolver';
import customAuthChecker from './lib/auth-checker';
import ActivityEntryResolver from './resolvers/activity-entry/activity-entry-resolvers';

async function getSchema() {
  return buildSchema({
    resolvers: [UserResolver, ActivityEntryResolver],
    validate: false,
    authChecker: customAuthChecker,
  });
}

export default getSchema;
