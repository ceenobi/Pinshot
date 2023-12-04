const searchUserOrPinsOrTags = (User, Pin) => async (query) => {
  const users = await User.find({
    userName: { $regex: query, $options: "i" },
  });
  const pins = await Pin.find({
    // $text: {
    //   $search: query,
    // },
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { tags: { $regex: query, $options: "i" } },
    ],
  });
  return users.concat(pins);
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
    getTags: getTags(Pin),
  };
};
