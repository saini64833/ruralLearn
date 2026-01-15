import { useEffect, useState } from "react";

export const useNetworkSpeed = () => {
  const [slowNetwork, setSlowNetwork] = useState(false);

  useEffect(() => {
    const connection = navigator.connection;

    if (!connection) return;

    const updateNetwork = () => {
      setSlowNetwork(
        connection.effectiveType === "2g" ||
        connection.effectiveType === "slow-2g"
      );
    };

    updateNetwork();
    connection.addEventListener("change", updateNetwork);

    return () => {
      connection.removeEventListener("change", updateNetwork);
    };
  }, []);

  return slowNetwork;
};
