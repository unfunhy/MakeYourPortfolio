import React from "react";

const UserContext = React.createContext({
  id: 0,
  name: "",
  setUser: () => {},
});

export default UserContext;
