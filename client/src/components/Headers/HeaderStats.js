import React,{ useEffect } from "react";
import  useWindowDimensions from "services/useWindowDimensions";


export default function HeaderStats() {
  const { height, width } = useWindowDimensions();

  useEffect( ()=>  {

  },[]);

  return (
    <>
      {/* Header */}
      <div className={"radius-nav  relative md:pt-4 " + ((width < 768) ? " bg-transparent" : " pb-4 pt-10 bg-green-mbk")} >
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}

          </div>
        </div>
      </div>
    </>
  );
}
