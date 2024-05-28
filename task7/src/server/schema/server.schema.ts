import { Schema } from 'mongoose';

export const ServerSchema = new Schema({
  url: { type: String, required: true },
  status: { type: String, enum: ['active', 'deactivated'], default: 'active' },
  failCount: { type: Number, default: 0 },
  conditions: {
    cpu: { type: [Number], default: [] },
    memory: {
      total: { type: Number, default: 0 },
      free: { type: Number, default: 0 }
    }
  }
});
