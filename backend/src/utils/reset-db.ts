/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import { db } from '../db';
import Category from '../entities/category/category';
import User from '../entities/user/user';
import ActivityEntryService from '../services/activity-entry-service';
import CategoryService from '../services/category-service';
import UserService from '../services/user-service';

export default async function resetDB() {
  const runner = db.createQueryRunner();
  await runner.query("SET session_replication_role = 'replica'");
  await Promise.all(
    db.entityMetadatas.map(async (entity) =>
      runner.query(`ALTER TABLE "${entity.tableName}" DISABLE TRIGGER ALL`),
    ),
  );
  await Promise.all(
    db.entityMetadatas.map(async (entity) =>
      runner.query(`DROP TABLE IF EXISTS "${entity.tableName}" CASCADE`),
    ),
  );
  await runner.query("SET session_replication_role = 'origin'");
  await db.synchronize();
}

async function createActivities(user: User, categories: Category[]) {
  const startDate = new Date('2023-06-01');
  const endDate = new Date('2024-06-11');
  const activitiesPerDay = 4;

  const activityTitles: Record<string, string[]> = {
    Transport: [
      'Trajet domicile-travail',
      'Course en voiture',
      'Voyage en train',
      'Déplacement professionnel',
      'Week-end en voiture',
    ],
    Alimentation: [
      'Déjeuner',
      'Dîner',
      'Courses alimentaires',
      'Restaurant',
      'Repas entre amis',
    ],
    Logement: [
      "Consommation d'électricité",
      'Chauffage',
      'Eau chaude',
      'Entretien de la maison',
      'Réparations',
    ],
    Autre: [
      'Achats divers',
      'Sortie culturelle',
      'Activité sportive',
      'Voyage personnel',
      'Loisirs',
    ],
  };

  const activityInputs: Record<string, number[]> = {
    Transport: [5, 10, 15, 10, 25],
    Alimentation: [1, 2, 3, 5, 6],
    Logement: [12, 16, 20, 11, 14],
    Autre: [8, 9, 3, 13, 19],
  };

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    for (let i = 0; i < activitiesPerDay; i++) {
      const categoryIndex = i % categories.length;
      const category = categories[categoryIndex];
      const categoryName = category.name;

      const titleList = activityTitles[categoryName];
      const inputList = activityInputs[categoryName];

      const title = titleList[Math.floor(Math.random() * titleList.length)];
      const input = inputList[Math.floor(Math.random() * inputList.length)];

      await ActivityEntryService.create({
        name: title,
        input,
        category,
        user,
        spendedAt: d.toISOString(),
      });
    }
  }
}

async function main() {
  await db.initialize();
  await resetDB();

  const user1 = await UserService.create({
    email: 'carbon-tracker@support.fr',
    password: 'carbonpassword',
  });

  await UserService.create({
    email: 'carbon-tracker2@support.fr',
    password: 'carbonpassword',
  });

  await UserService.create({
    email: 'carbon-tracker3@support.fr',
    password: 'carbonpassword',
  });

  const category1 = await CategoryService.create({ name: 'Transport' });
  const category2 = await CategoryService.create({ name: 'Alimentation' });
  const category3 = await CategoryService.create({ name: 'Logement' });
  const category4 = await CategoryService.create({ name: 'Autre' });

  const categories = [category1, category2, category3, category4];

  await createActivities(user1, categories);

  await db.destroy();
  console.info('♻️ Database successfully reset!');
}

main();
