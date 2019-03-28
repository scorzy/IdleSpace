export interface IAlert {
  id: string;
  getType: () => string;
  getMessage: () => string;
  getCondition: () => boolean;
}
