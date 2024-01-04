import PropTypes from "prop-types";

const PageLayout = ({ children, extra, ...props }) => {
  return (
    <div className={`page-adjust w-100 ${extra}`} {...props}>
      {children}
    </div>
  );
};

export default PageLayout;

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  extra: PropTypes.string,
  props: PropTypes.string,
};
