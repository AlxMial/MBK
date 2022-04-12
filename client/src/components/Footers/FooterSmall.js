import React from "react";

export default function FooterSmall(props) {
  return (
    <>
      <footer
        className={
          (props.absolute
            ? "absolute w-full bottom-0"
            : "relative") + " pb-6"
        }
      >
        <div className="container mx-auto px-4">
     
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full px-4">
              <div className="text-sm text-black font-semibold py-1 text-center ">
                Copyright © UNDEFINED CO., LTD. All right reserved
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
