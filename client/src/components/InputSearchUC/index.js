import React from "react";
import useWindowDimensions from "services/useWindowDimensions";

const InputSearchUC = ({ onChange, id }) => {
  const { width } = useWindowDimensions();
  const _searchClass =
    "border-0 pl-12 placeholder-blueGray-300 " +
    " text-blueGray-600 relative bg-white rounded-xl text-sm shadow " +
    " outline-none focus:outline-none focus:ring " +
    (width < 768 ? " w-full " : " w-64");
  return (
    <>
      <span className="z-3 leading-snug font-normal text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center pl-3 py-2">
        <i className="fas fa-search"></i>
      </span>
      <input
        id={id}
        type="text"
        placeholder="Search here..."
        className={_searchClass}
        onChange={onChange}
      />
    </>
  );
};

export default InputSearchUC;
