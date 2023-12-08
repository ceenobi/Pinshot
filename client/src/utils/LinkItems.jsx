import { Icon } from "@iconify/react";

const links = [
  {
    icon: <Icon icon="ic:sharp-home" />,
    path: "",
    label: "Home",
  },
  {
    icon: <Icon icon="ic:outline-trending-up" />,
    path: "trending",
    label: "Trending",
  },
  {
    icon: <Icon icon="ic:outline-trending-up" />,
    path: "following",
    label: "Following",
  },
];

 // [...file].forEach((file, i) => {
  //   formData.append("file", file, file[i]);
  //   formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  // });

export default links;
