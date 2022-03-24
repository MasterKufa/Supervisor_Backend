import { Ability, InferSubjects } from '@casl/ability';
import { Record } from 'src/records/records.module';
import { User } from 'src/users/types';

export type Subjects =
  | InferSubjects<typeof Record | typeof User | string>
  | 'all';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type AppAbility = Ability<[Action, Subjects]>;

export interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

export type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
