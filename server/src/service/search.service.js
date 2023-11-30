const searchUserOrPinsOrTags = (User, Pin) => async (query) => {
  const users = await User.find({
    userName: { $regex: query, $options: "i" },
  });
  const pins = await Pin.find({
    // $text: {
    //   $search: query,
    // },
    title: { $regex: query, $options: "i" },
  });
  const tags = await Pin.find({ tags: { $regex: query, $options: "i" } });
  return users.concat(pins, tags);
};

const searchPinsByTags = (Pin) => async (tag) => {
  return;
};

const getTags = (Pin) => async () => {
  const getPins = await Pin.find();
  const filterTags = getPins.flatMap((pin) => pin.tags);
  const removeDuplicates = [
    ...filterTags.filter((item, i) => {
      return filterTags.indexOf(item) === i && item.length > 0;
    }),
  ];
  return removeDuplicates;
};

export default (User, Pin) => {
  return {
    searchUserOrPinsOrTags: searchUserOrPinsOrTags(User, Pin),
    searchPinsByTags: searchPinsByTags(Pin),
    getTags: getTags(Pin),
  };
};
