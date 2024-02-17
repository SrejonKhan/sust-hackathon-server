const findWithId = async (Model, id, options = {}) => {
  try {
    const item = await Model.findById(id, options);
    return item;
  } catch (error) {
    throw error;
  }
};

module.exports = { findWithId };
