import { Icon } from "@iconify/react";

const links = [
  {
    icon: <Icon icon="ic:sharp-home" />,
    path: "",
    label: "Home",
  },
  {
    icon: <Icon icon="material-symbols:explore-outline-rounded" />,
    path: "explore",
    label: "Explore",
  },
];

// [...file].forEach((file, i) => {
//   formData.append("file", file, file[i]);
//   formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
// });

export default links;
