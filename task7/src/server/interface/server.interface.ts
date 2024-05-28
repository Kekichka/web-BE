import { Document } from 'mongoose';

export interface Server extends Document {
  url: string;
  status: 'active' | 'deactivated';
  failCount: number;
  conditions: {
    cpu: number[];
    memory: {
      total: number;
      free: number;
    };
  };
}
