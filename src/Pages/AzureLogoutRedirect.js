import React from "react";

const AzureLogoutRedirect = () => {
  sessionStorage.clear();
  localStorage.clear();
  React.useEffect(() => {
    window.location.href = "/logout/";
  }, []);

  return;
};

export default AzureLogoutRedirect;
