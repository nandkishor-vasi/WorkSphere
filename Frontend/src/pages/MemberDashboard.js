import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  CircularProgress,
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";
import ProjectList from "./TeamMember/ProjectList";
import ActivityList from "./TeamMember/ActivityList";

const drawerWidth = 240;

const TeamMemberDashboard = () => {
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const userId = userData?.id;
  const token = userData?.token;
  const backendBaseUrl = "http://localhost:8080";

  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const projectsRef = useRef(null);
  const activitiesRef = useRef(null);

  useEffect(() => {
    if (!userId || !token) {
      console.log(userData);
      return;
    }

    const fetchProjects = axios.get(
      `${backendBaseUrl}/api/projects/projectByMember/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const fetchActivities = axios.get(
      `${backendBaseUrl}/api/activities/member/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Promise.all([fetchProjects, fetchActivities])
      .then(([projRes, actRes]) => {
        setProjects(projRes.data);
        setActivities(actRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard load error:", err);
        setLoading(false);
      });
  }, [userId, token]);

  const handleActivityStatusUpdate = async (activityId, newStatus) => {
    try {
      await axios.patch(
        `${backendBaseUrl}/api/activities/${activityId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setActivities((prev) =>
        prev.map((act) =>
          act.id === activityId ? { ...act, status: newStatus } : act
        )
      );
    } catch (err) {
      console.error("Failed to update activity:", err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", bgcolor: "grey.50", minHeight: "100vh" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        
      </AppBar>

      {/* Sidebar */}
      <Box
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          bgcolor: "#f4f5f7",
          minHeight: "100vh",
          borderRight: "1px solid #e0e0e0",
          pt: 8,
          px: 2,
        }}
      >
        {/* User Info */}
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar sx={{ width: 80, height: 80, mb: 1, bgcolor: "#667eea" }}>
            {userData?.username?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Typography variant="h6" fontWeight={600}>
            {userData?.username || "User"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Team Member
          </Typography>
          <Divider sx={{ width: "100%", my: 2 }} />
        </Box>

        {/* Navigation */}
        <List>
          <ListItemButton component={Link} to={`/member/${userData?.id}/project`}>
            <ListItemText primary="Projects" />
          </ListItemButton>

          <ListItemButton component={Link} to={`/member/${userData?.id}/activity`}>
            <ListItemText primary="Activities" />
          </ListItemButton>
        </List>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> 

        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Profile Information
                </Typography>
                <Typography variant="body1"><b>Name:</b> {userData?.username}</Typography>
                <Typography variant="body1"><b>Email:</b> {userData?.email}</Typography>
                <Typography variant="body1"><b>Role:</b> Team Member</Typography>
              </Paper>
            </Grid>

            {/* Projects + Activities */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    }}
                  >
                    <ProjectList projects={projects} />
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    }}
                  >
                    <ActivityList
                      activities={activities}
                      onUpdateStatus={handleActivityStatusUpdate}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default TeamMemberDashboard;
