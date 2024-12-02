import React from "react";

const AzureLoginRedirect = () => {
  React.useEffect(() => {
    window.location.href = "/login/";
  }, []);

  return;
};

export default AzureLoginRedirect;
