export enum StatusOfServiceCard {
  BINDING = 'BINDING',

  NON_BINDING = 'NON_BINDING',
}

export const StatusMapping: Record<StatusOfServiceCard, string> = {
  [StatusOfServiceCard.BINDING]: 'Obowiązująca',
  [StatusOfServiceCard.NON_BINDING]: 'Nieobowiązująca',
};
