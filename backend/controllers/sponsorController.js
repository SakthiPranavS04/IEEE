import Sponsor from '../models/Sponsor.js';

// @desc    Get all sponsors
// @route   GET /api/sponsors
// @access  Public
export const getSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find({});
    res.json(sponsors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sponsor by ID
// @route   GET /api/sponsors/:id
// @access  Public
export const getSponsorById = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    if (sponsor) {
      res.json(sponsor);
    } else {
      res.status(404).json({ message: 'Sponsor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a sponsor
// @route   POST /api/sponsors
// @access  Private/Admin
export const createSponsor = async (req, res) => {
  try {
    const { name, logo, websiteUrl, tier } = req.body;

    const sponsor = new Sponsor({
      name,
      logo,
      websiteUrl,
      tier,
    });

    const createdSponsor = await sponsor.save();
    res.status(201).json(createdSponsor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a sponsor
// @route   PUT /api/sponsors/:id
// @access  Private/Admin
export const updateSponsor = async (req, res) => {
  try {
    const { name, logo, websiteUrl, tier } = req.body;

    const sponsor = await Sponsor.findById(req.params.id);

    if (sponsor) {
      sponsor.name = name || sponsor.name;
      sponsor.logo = logo || sponsor.logo;
      sponsor.websiteUrl = websiteUrl !== undefined ? websiteUrl : sponsor.websiteUrl;
      sponsor.tier = tier || sponsor.tier;

      const updatedSponsor = await sponsor.save();
      res.json(updatedSponsor);
    } else {
      res.status(404).json({ message: 'Sponsor not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a sponsor
// @route   DELETE /api/sponsors/:id
// @access  Private/Admin
export const deleteSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);

    if (sponsor) {
      await sponsor.deleteOne();
      res.json({ message: 'Sponsor removed' });
    } else {
      res.status(404).json({ message: 'Sponsor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
