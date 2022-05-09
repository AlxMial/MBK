import { useState, useEffect } from "react";

export default function useMenu() {
  function getMenu(val) {
    const menu = val === undefined ? false : val;
    return {
      menu,
    };
  }
  const [isMenu, setIsMenu] = useState(getMenu());

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        e.toElement.id === "back" ||
        e.toElement.id === "save" ||
        e.toElement.id === "dropdownDefault"
      ) {
        setIsMenu(getMenu(true));
      } else {
        setIsMenu(getMenu(false));
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, []);

  return isMenu;
}
