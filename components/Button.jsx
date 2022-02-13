function Button({ children, className, onClick, disabled = false }) {
  return (
    <button
      disabled={disabled}
      onClick={(e) => typeof onClick === "function" && onClick(e)}
      className={`${
        className ? className : ""
      } py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-50 text-center text-base font-semibold shadow-md shadow-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg`}
    >
      {children}
    </button> 
  );
}

export default Button;
