const brandColor = "#D0B027";
const styleSelect = () => ({
  control: (base, state) => ({
    ...base,
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
  }),
});

export default styleSelect;
