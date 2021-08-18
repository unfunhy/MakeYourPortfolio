import React from "react";

const UserContext = React.createContext({
  id: 0,
  user_id: "",
  setUser: () => {},
});

export default UserContext;
