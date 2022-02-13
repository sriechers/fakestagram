function LoadingSpinner({ height = "2rem", width = "2rem", className }) {
  return (
    <div
      style={{ height: height, width: width }}
      className={`${
        className ? className : ""
      } absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 sk-circle`}
    >
      <div className="sk-circle1 sk-child"></div>
      <div className="sk-circle2 sk-child"></div>
      <div className="sk-circle3 sk-child"></div>
      <div className="sk-circle4 sk-child"></div>
      <div className="sk-circle5 sk-child"></div>
      <div className="sk-circle6 sk-child"></div>
      <div className="sk-circle7 sk-child"></div>
      <div className="sk-circle8 sk-child"></div>
      <div className="sk-circle9 sk-child"></div>
      <div className="sk-circle10 sk-child"></div>
      <div className="sk-circle11 sk-child"></div>
      <div className="sk-circle12 sk-child"></div>
    </div>
  );
}

export default LoadingSpinner;
