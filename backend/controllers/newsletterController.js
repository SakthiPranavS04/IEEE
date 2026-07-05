import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

// @desc    Get all subscribers
// @route   GET /api/newsletter
// @access  Private/Admin
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await NewsletterSubscriber.find({}).sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get subscriber by ID
// @route   GET /api/newsletter/:id
// @access  Private/Admin
export const getSubscriberById = async (req, res) => {
  try {
    const subscriber = await NewsletterSubscriber.findById(req.params.id);

    if (subscriber) {
      res.status(200).json(subscriber);
    } else {
      res.status(404).json({ message: 'Subscriber not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriberExists = await NewsletterSubscriber.findOne({ email });

    if (subscriberExists) {
      if (subscriberExists.status === 'Unsubscribed') {
        subscriberExists.status = 'Subscribed';
        await subscriberExists.save();
        return res.status(200).json({ message: 'Successfully re-subscribed' });
      }
      return res.status(400).json({ message: 'Email is already subscribed' });
    }

    const subscriber = new NewsletterSubscriber({
      email,
    });

    const createdSubscriber = await subscriber.save();
    res.status(201).json(createdSubscriber);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update subscriber status (Unsubscribe)
// @route   PUT /api/newsletter/:id
// @access  Public or Private/Admin
export const updateSubscriberStatus = async (req, res) => {
  try {
    const subscriber = await NewsletterSubscriber.findById(req.params.id);

    if (subscriber) {
      subscriber.status = req.body.status || subscriber.status;
      const updatedSubscriber = await subscriber.save();
      res.json(updatedSubscriber);
    } else {
      res.status(404).json({ message: 'Subscriber not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete subscriber
// @route   DELETE /api/newsletter/:id
// @access  Private/Admin
export const deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await NewsletterSubscriber.findById(req.params.id);

    if (subscriber) {
      await subscriber.deleteOne();
      res.json({ message: 'Subscriber removed' });
    } else {
      res.status(404).json({ message: 'Subscriber not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
