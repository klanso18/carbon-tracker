import { buildActivitiesCsv } from '@/utils/activitiesCsv';

const activity = (name: string, spendedAt: string, input = 1.5) => ({
  id: 1,
  name,
  input,
  createdAt: spendedAt,
  spendedAt,
  category: { id: 1, name: 'Transport' },
});

const rowsOf = (csv: string) => csv.replace('﻿', '').split('\r\n');

describe('buildActivitiesCsv', () => {
  it('starts with a BOM and the header', () => {
    const csv = buildActivitiesCsv([]);

    expect(csv.startsWith('﻿')).toBe(true);
    expect(rowsOf(csv)).toEqual(['Date;Nom;Catégorie;Émissions (kg CO2e)']);
  });

  it('writes the date, a decimal comma and the most recent activity first', () => {
    const rows = rowsOf(
      buildActivitiesCsv([
        activity('Train', '2026-01-10T08:00:00.000Z'),
        activity('Avion', '2026-02-20T08:00:00.000Z', 250),
      ]),
    );

    expect(rows[1]).toBe('2026-02-20;"Avion";"Transport";250');
    expect(rows[2]).toBe('2026-01-10;"Train";"Transport";1,5');
  });

  it('keeps separators and quotes inside the cell', () => {
    const rows = rowsOf(
      buildActivitiesCsv([activity('Le "TGV"; Paris', '2026-01-10T08:00:00Z')]),
    );

    expect(rows[1]).toContain('"Le ""TGV""; Paris"');
  });

  it.each(['=1+1', '+33', '-2', '@SUM(A1)'])(
    'neutralises the formula %s',
    (name) => {
      const rows = rowsOf(
        buildActivitiesCsv([activity(name, '2026-01-10T08:00:00Z')]),
      );

      expect(rows[1]).toContain(`"'${name}"`);
    },
  );
});
