import React from "react";
import SidePanel from "./SidePanel";

const FixedSidePanel = ({ activeTab, userLocation }) => {
  return <SidePanel activeTab={activeTab} userLocation={userLocation} />;
};

export default FixedSidePanel;
