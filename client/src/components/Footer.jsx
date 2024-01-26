import { PageLayout } from "@layouts";
import { useAuthContext } from "@config";
import { footerLinks } from "@utils";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import { userService } from "@services";

const Footer = () => {
  const { loggedInUser, isDark } = useAuthContext();
  const footerIcons = [
    ...footerLinks,
    {
      icon: <Icon icon="iconamoon:profile-light" />,
      path: `profile/${loggedInUser?.userName}`,
      label: "Profile",
    },
  ];

  return (
    <PageLayout
      extra="d-block d-md-none position-sticky bottom-0 px-3"
      style={{
        zIndex: 5,
        backgroundColor: isDark ? "var(--color-Dark)" : "var(--color-Light)",
      }}
    >
      <div className="d-flex align-items-center justify-content-between text-center">
        {footerIcons.map((link, i) => (
          <NavLink
            to={`/${link.path}`}
            key={i}
            className={({ isActive }) =>
              isActive ? "activeIcon" : "no-activeIcon"
            }
            title={link.label}
          >
            <div className="mb-0 fs-1">{link.icon}</div>
            <p>{link.label}</p>
          </NavLink>
        ))}
        <div className="mt-2">
          <Icon
            icon="prime:power-off"
            className="fs-1 mb-1 logout"
            title="logout"
            onClick={() => userService.logout()}
          />
          <p>Logout</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Footer;
