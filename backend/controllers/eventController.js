import Event from '../models/Event.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res) => {
  try {
    const { title, description, desc, date, location, venue, banner, isPublished, isRegistrationOpen, gallery, tag, highlights, isHighlighted, highlightOrder, highlightDescription, highlightImage, highlightTheme, link, time, isUpcoming } = req.body;

    const event = new Event({
      title,
      description,
      desc,
      date,
      location,
      venue,
      banner,
      isPublished,
      isRegistrationOpen,
      gallery,
      tag,
      highlights,
      isHighlighted,
      highlightOrder,
      highlightDescription,
      highlightImage,
      highlightTheme,
      link,
      time,
      isUpcoming
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res) => {
  try {
    const { title, description, desc, date, location, venue, banner, isPublished, isRegistrationOpen, gallery, tag, highlights, isHighlighted, highlightOrder, highlightDescription, highlightImage, highlightTheme, link, time, isUpcoming } = req.body;

    const event = await Event.findById(req.params.id);

    if (event) {
      event.title = title || event.title;
      event.description = description || event.description;
      event.desc = desc !== undefined ? desc : event.desc;
      event.date = date || event.date;
      event.location = location || event.location;
      event.venue = venue !== undefined ? venue : event.venue;
      event.banner = banner || event.banner;
      event.isPublished = isPublished !== undefined ? isPublished : event.isPublished;
      event.isRegistrationOpen = isRegistrationOpen !== undefined ? isRegistrationOpen : event.isRegistrationOpen;
      event.gallery = gallery || event.gallery;
      event.tag = tag !== undefined ? tag : event.tag;
      event.highlights = highlights !== undefined ? highlights : event.highlights;
      event.isHighlighted = isHighlighted !== undefined ? isHighlighted : event.isHighlighted;
      event.highlightOrder = highlightOrder !== undefined ? highlightOrder : event.highlightOrder;
      event.highlightDescription = highlightDescription !== undefined ? highlightDescription : event.highlightDescription;
      event.highlightImage = highlightImage !== undefined ? highlightImage : event.highlightImage;
      event.highlightTheme = highlightTheme !== undefined ? highlightTheme : event.highlightTheme;
      event.link = link !== undefined ? link : event.link;
      event.time = time !== undefined ? time : event.time;
      event.isUpcoming = isUpcoming !== undefined ? isUpcoming : event.isUpcoming;

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
