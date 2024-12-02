import React from "react";

const AzureLogoutRedirect = () => {
  sessionStorage.removeItem("isAuthenticated");
  React.useEffect(() => {
    window.location.href = "/logout/";
  }, []);

  return;
};

export default AzureLogoutRedirect;
