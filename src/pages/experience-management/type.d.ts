import type { User } from '../user-management/types';

export type Experience = {
  id: number;
  name: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  startDate: string;
  endDate: string;
  user: User;
};

export type SearchExperienceInput = {
  name: string;
  username: string;
};
