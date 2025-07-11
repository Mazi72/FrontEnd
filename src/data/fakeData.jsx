import { faker } from '@faker-js/faker';

// Generazione di dati fittizi per gli utenti
export const fakeUsers = Array.from({ length: 5 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.firstName(), 
  role: 'athlete',
}));
