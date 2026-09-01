import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteContent extends Document {
  page: string;
  data: any;
  lastUpdatedBy?: mongoose.Types.ObjectId;
}

const SiteContentSchema: Schema = new Schema({
  page: { type: String, required: true, unique: true },
  data: { type: Schema.Types.Mixed, required: true },
  lastUpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model<ISiteContent>('SiteContent', SiteContentSchema);
