import mongoose from 'mongoose';

const newsletterSubscriberSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    status: { type: String, required: true, default: 'Subscribed' },
  },
  {
    timestamps: true,
  }
);

const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);

export default NewsletterSubscriber;
