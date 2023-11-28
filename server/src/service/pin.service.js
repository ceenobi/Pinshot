const createPin =
  (Pin) =>
  async ({ userId, title, tags, description, image, avatar, owner }) => {
    const newPin = new Pin({
      userId,
      title,
      tags,
      description,
      image,
      avatar,
      owner,
    });
    return newPin.save();
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
const getPin = (Pin) => async (pinId) => {
  return await Pin.findById(pinId).populate("userId", "subscribedUsers");
};

const getRelatedPin = (Pin) => async (pinId) => {
  const getPin = await Pin.findById(pinId);
  const getTags = getPin.tags;
  const getRelatedPinTags = await Pin.find({ tags: { $in: getTags } });
  return getRelatedPinTags.filter((allTags) => allTags.id !== pinId);
};


const updatePin =
  (Pin) =>
  async (pinId, { title, tags, description, image }) => {
    const pin = await Pin.findById(pinId)((pin.title = title || pin.title))(
      (pin.tags = tags || pin.tags)
    )((pin.description = description || pin.description))(
      (pin.image = image || pin.image)
    );

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
const searchPinsByTags = (Pin) => async (tag) => {
  return await Pin.find({ tags: { $in: tag } }).limit(20);
};

const searchPins = (Pin) => async (query) => {
  return await Pin.find({
    $text: {
      $search: query,
    },
  }).limit(20);
};

const getSubbedUserPins = (Pin) => async (subscribedPins) => {
  return await Promise.all(
    subscribedPins.map(async (pinId) => {
      return Pin.find({ userId: pinId });
    })
  );
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
    searchPinsByTags: searchPinsByTags(Pin),
    searchPins: searchPins(Pin),
    getSubbedUserPins: getSubbedUserPins(Pin),
    getPinsByUser: getPinsByUser(Pin),
    getRelatedPin: getRelatedPin(Pin),
  };
};
