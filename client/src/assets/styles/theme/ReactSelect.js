const brandColor = "#D0B027";
export const styleSelect = (bgColor) => ({
  control: (base, state) => ({
    ...base,
    boxShadow: state.isFocused ? 0 : 0,
    borderColor: state.isFocused ? brandColor : base.borderColor,
    "&:hover": {
      borderColor: state.isFocused ? brandColor : base.borderColor,
    },
    backgroundColor:state.isDisabled ? "#F2F2F2" : "" ,
    // backgroundColor: bgColor ? bgColor : "none",
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#D0B027"
      : state.isFocused
        ? "#fff"
        : provided.backgroundColor,
    "&:hover": {
      backgroundColor: state.isSelected ? "#D0B027" : "#fff",
    },
  }),
  menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
  menu: (provided) => ({ ...provided, zIndex: 9999 })
});

export const styleSelectLine = () => ({
  control: (base, state) => ({
    ...base,
    border: state.isFocused ? '1px solid #D0B027' : '1px solid #e4e4e7',
    borderRadius: '0.75rem',
    boxShadow: state.isFocused ? 0 : 0,
    borderColor: state.isFocused ? brandColor : base.borderColor,
    "&:hover": {
      borderColor: state.isFocused ? brandColor : base.borderColor,
    },
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#D0B027"
      : state.isFocused
        ? "#fff"
        : provided.backgroundColor,
    "&:hover": {
      backgroundColor: state.isSelected ? "#D0B027" : "#fff",
    },
    zIndex: 9999,
  }),

});