const PrivateEventRequest = require('../models/PrivateEventRequest');
const Package = require('../models/Package');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Organizer = require('../models/Organizer');

// GET DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalAppointments,
      totalPackages,
      totalCategories,
      totalReviews,
      totalOrganizers,
      activeOrganizers,
      recentAppointments
    ] = await Promise.all([
      PrivateEventRequest.countDocuments(),
      Package.countDocuments(),
      Category.countDocuments(),
      Review.countDocuments({ isActive: true }),
      Organizer.countDocuments(),
      Organizer.countDocuments({ isActive: true }),
      PrivateEventRequest.find()
        .sort({ created_at: -1 })
        .limit(5)
        .populate('client_id', 'name email')
        .select('full_name event_type event_date status package_id')
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalAppointments,
          totalPackages,
          totalCategories,
          totalReviews,
          totalOrganizers,
          activeOrganizers
        },
        recentAppointments: recentAppointments.map(apt => ({
          id: apt._id,
          client: apt.full_name,
          event: apt.event_type,
          date: apt.event_date,
          decoration: apt.package_id ? (typeof apt.package_id === 'object' ? apt.package_id.package_name : apt.package_id) : 'Custom',
          status: apt.status || 'pending'
        }))
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
