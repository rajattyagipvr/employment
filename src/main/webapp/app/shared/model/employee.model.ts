import { Moment } from 'moment';
import { IJob } from 'app/shared/model/job.model';
import { IDepartment } from 'app/shared/model/department.model';

export interface IEmployee {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  hireDate?: string;
  salary?: number;
  commissionPct?: number;
  jobs?: IJob[];
  manager?: IEmployee;
  department?: IDepartment;
}

export const defaultValue: Readonly<IEmployee> = {};
