export interface IUnlockable {
  unlocked: boolean;
  id: string;
  name: string;
  description: string;
  unlock(): boolean;
}
