import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Divider,
} from "@mui/material";
import { Link, useParams, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ActivityIcon from "@mui/icons-material/Timeline";

const drawerWidth = 240;
const Sidebar = ({ adminId }) => {
  const location = useLocation();

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: `/adminDashboard/${adminId}`,
    },
    {
      text: "Projects",
      icon: <FolderIcon />,
      path: `/admin/${adminId}/projects`,
    },
    {
      text: "Analytics",
      icon: <AssessmentIcon />,
      path: `/admin/${adminId}/reports`,
    },
    {
      text: "Activity",
      icon: <ActivityIcon />,
      path: `/admin/${adminId}/activity`,
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "linear-gradient(180deg, #2c3e50 0%, #34495e 100%)",
          color: "white",
          borderRight: "none",
        },
      }}
    >
      <Toolbar />
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
      <Box sx={{ overflow: "auto", pt: 2 }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem
                key={item.text}
                button
                component={Link}
                to={item.path}
                sx={{
                  mx: 1,
                  mb: 1,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  backgroundColor: isActive
                    ? "rgba(102, 126, 234, 0.3)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: isActive
                      ? "rgba(102, 126, 234, 0.4)"
                      : "rgba(255, 255, 255, 0.1)",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "#667eea" : "rgba(255, 255, 255, 0.7)",
                    transition: "color 0.3s ease",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiTypography-root": {
                      color: isActive ? "white" : "rgba(255, 255, 255, 0.8)",
                      fontWeight: isActive ? 600 : 400,
                      transition: "all 0.3s ease",
                    },
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
