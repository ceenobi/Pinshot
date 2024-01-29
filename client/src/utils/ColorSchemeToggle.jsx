import { Icon } from "@iconify/react";
import { useAuthContext } from "@hooks";

const ColorSchemeToggle = () => {
  const { isDark, toggleColorScheme } = useAuthContext();

  return (
    <div title={isDark ? "toggle light-mode" : "toggle dark-mode"}>
      {isDark ? (
        <Icon
          icon="icon-park-solid:dark-mode"
          className="fs-4 cursor"
          onClick={toggleColorScheme}
        />
      ) : (
        <Icon
          icon="iconamoon:mode-light"
          className="fs-4 cursor"
          onClick={toggleColorScheme}
        />
      )}
    </div>
  );
};

export default ColorSchemeToggle;
