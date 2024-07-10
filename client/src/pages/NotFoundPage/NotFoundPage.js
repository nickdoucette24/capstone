import "./NotFoundPage.scss";

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <div className="not-found__container">
        <h1 className="not-found__error">404</h1>
        <h2 className="not-found__heading">Page Not Found</h2>
        <h3 className="not-found__description">
          The page you are looking for either does not exist or has not left the
          garage. Please check the URL or try again later.
        </h3>
      </div>
    </div>
  );
};

export default NotFoundPage;
