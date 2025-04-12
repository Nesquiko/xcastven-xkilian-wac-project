import { ConditionDisplay } from '../api/generated';

export const ActiveConditionsExample = [
  {
    id: 'active-condition-1',
    name: 'Active Flu',
    start: new Date(2025, 3, 10),
  } satisfies ConditionDisplay,
  {
    id: 'active-condition-1',
    name: 'Active Migraine',
    start: new Date(2025, 3, 11),
  } satisfies ConditionDisplay,
  {
    id: 'active-condition-1',
    name: 'Active Broken Leg',
    start: new Date(2025, 3, 12),
  } satisfies ConditionDisplay,
] satisfies Array<ConditionDisplay>;
