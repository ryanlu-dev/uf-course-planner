import React from "react";

const AzureLogoutRedirect = () => {
  sessionStorage.removeItem("isAuthenticated");
  React.useEffect(() => {
    window.location.href = "https://ufcourseplanner.ryanlu.dev/logout/";
  }, []);

  return;
};

export default AzureLogoutRedirect;
