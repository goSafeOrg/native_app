import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

const useScreenSize = () => {
  const [isPortrait, setIsPortrait] = useState(Dimensions.get("window").width < 1100);

  useEffect(() => {
    const updateLayout = () => {
      setIsPortrait(Dimensions.get("window").width < 1100);
    };

    const width = Dimensions.addEventListener("change", updateLayout);

    return () => {
      width?.remove();
    };
  }, [Dimensions.get("window").width]);

  return isPortrait;
};

export default useScreenSize;