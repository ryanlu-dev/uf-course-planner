import React from "react";

const AzureLoginRedirect = () => {
  React.useEffect(() => {
    window.location.href = "https://ufcourseplanner.ryanlu.dev/login/";
  }, []);

  return;
};

export default AzureLoginRedirect;
