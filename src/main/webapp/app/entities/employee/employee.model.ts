export interface IEmployee {
  id: number;
  name?: string | null;
  surname?: string | null;
}

export type NewEmployee = Omit<IEmployee, 'id'> & { id: null };
