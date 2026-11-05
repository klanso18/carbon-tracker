import { ActivityEntriesQuery } from '@/graphql/generated/schema';
import { EMISSION_UNIT } from './numberFormater';

type Activity = ActivityEntriesQuery['activityEntries'][number];

// ";" and a decimal comma are what a French Excel expects, and the BOM makes it
// read the file as UTF-8 (accents would be broken otherwise).
const SEPARATOR = ';';
const BOM = '﻿';

function escapeCell(value: string): string {
  // A spreadsheet runs a cell starting with one of these as a formula
  const safeValue = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replace(/"/g, '""')}"`;
}

function toRow(activity: Activity): string {
  return [
    activity.spendedAt.slice(0, 10),
    escapeCell(activity.name),
    escapeCell(activity.category.name),
    String(activity.input).replace('.', ','),
  ].join(SEPARATOR);
}

export function buildActivitiesCsv(activities: Activity[]): string {
  const header = ['Date', 'Nom', 'Catégorie', `Émissions (${EMISSION_UNIT})`];
  const rows = [...activities]
    .sort((a, b) => b.spendedAt.localeCompare(a.spendedAt))
    .map(toRow);
  return BOM + [header.join(SEPARATOR), ...rows].join('\r\n');
}

export function downloadCsv(content: string, fileName: string): void {
  const url = URL.createObjectURL(
    new Blob([content], { type: 'text/csv;charset=utf-8' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
