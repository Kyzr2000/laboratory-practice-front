export type Unit = {
  unitNumber: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FindUnitsInput = {
  unitNumber: string;
  name: string;
};
