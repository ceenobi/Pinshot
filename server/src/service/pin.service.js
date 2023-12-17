const createPin =
  (Pin) =>
  async ({ userId, title, description, image, tags }) => {
    return await Pin.create({ userId, title, description, image, tags });
  };

const getRandomPins = (Pin) => async () => {
  return await Pin.aggregate([{ $sample: { size: 40 } }]);
};

const getPins = (Pin) => async (page, limit) => {
  return await Pin.find()
    .sort({ _id: -1 })
    .skip(page * limit);
};

const getPinsByUser = (Pin) => async (userId, page, limit) => {
  return await Pin.find({ userId: userId })
    .sort({ _id: -1 })
    .skip(page * limit);
};

const getPinsLikedByUser = (Pin) => async (userId, page, limit) => {
  return await Pin.find({ likes: userId })
    .sort({ _id: -1 })
    .skip(page * limit);
};

const getPin = (Pin) => async (pinId) => {
  return await Pin.findById(pinId).populate(
    "userId",
    "userName profilePhoto subscribers"
  );
};

const getRelatedPin = (Pin) => async (pinId) => {
  const getPin = await Pin.findById(pinId);
  const getTags = getPin.tags;
  const getRelatedPinTags = await Pin.find({ tags: { $in: getTags } });
  return getRelatedPinTags.filter((allTags) => allTags.id !== pinId);
};
// const updatePin =
//   (Pin) =>
//   async (pinId, { title, tags, description, image }) => {
//     const updatedPin = await Pin.findByIdAndUpdate(
//       pinId,
//       { title, tags, description, image },
//       { new: true }
//     );
//     return updatedPin;
//   };

const updatePin =
  (Pin) =>
  async (pinId, { title, tags, description, image }) => {
    const pin = await Pin.findById(pinId);
    Object.assign(pin, {
      title: title || pin.title,
      description: description || pin.description,
      image: image || pin.image,
      tags: tags || pin.tags,
    });
    return await pin.save();
  };

const likePin = (Pin) => async (userId, pinId) => {
  return await Pin.findByIdAndUpdate(pinId, {
    $addToSet: { likes: userId },
  });
};

const dislikePin = (Pin) => async (userId, pinId) => {
  return await Pin.findByIdAndUpdate(pinId, {
    $pull: { likes: userId },
  });
};
const deletePin = (Pin) => async (pinId) => {
  const pin = await Pin.findById(pinId);
  return await pin.deleteOne();
};

const getSubbedUserPins =
  (Pin) => async (subscribedPins, userId, page, limit) => {
    const pinIds = [...new Set(subscribedPins)]; // Remove duplicate pinIds
    const allPins = await Pin.find({
      $or: [{ userId: { $in: pinIds } }, { userId: userId }],
    })
      .sort({ _id: -1 })
      .skip(page * limit);
    const uniquePins = allPins.filter(
      (pin, index, self) => index === self.findIndex((p) => p.id === pin.id)
    ); // Remove duplicate pins
    return uniquePins;
  };

export default (Pin) => {
  return {
    createPin: createPin(Pin),
    getRandomPins: getRandomPins(Pin),
    getPins: getPins(Pin),
    getPin: getPin(Pin),
    updatePin: updatePin(Pin),
    likePin: likePin(Pin),
    dislikePin: dislikePin(Pin),
    deletePin: deletePin(Pin),
    getSubbedUserPins: getSubbedUserPins(Pin),
    getPinsByUser: getPinsByUser(Pin),
    getRelatedPin: getRelatedPin(Pin),
    getPinsLikedByUser: getPinsLikedByUser(Pin),
  };
};
