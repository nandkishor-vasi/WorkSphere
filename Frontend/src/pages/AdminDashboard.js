import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "../pages/AdminContents/Sidebar";
import Metrics from "../pages/AdminContents/Metrics";
import ProjectSummary from "../pages/AdminContents/ProjectSummary";
import UserInfoCard from "../pages/AdminContents/UserInfoCard";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import Navbar from "../components/Navbar";

const drawerWidth = 240;

const AdminDashboard = () => {
  const { adminId } = useParams();
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const token = userData?.token;
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;


  const [admin, setAdmin] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [projects, setProjects] = useState([]);
  const [membersList, setMembersList] = useState([]);

   const defaultMetrics = [
    { label: "Total Projects", value: "0", color: "#667eea" },
    { label: "Active Tasks", value: "0", color: "#764ba2" },
    { label: "Completed", value: "0", color: "#56cc9d" },
    { label: "Team Members", value: "0", color: "#ff6b6b" },
  ];

  useEffect(() => {

    if (!token || !adminId) return;
    
    const fetchAdmin = axios.get(`${backendBaseUrl}/api/admin/${adminId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchActivities = axios.get(`${backendBaseUrl}/api/activities/admin/${adminId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchProjects = axios.get(`${backendBaseUrl}/api/projects/projectByAdmin/${adminId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchMembers = axios.get(`${backendBaseUrl}/api/admin/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  Promise.all([fetchAdmin, fetchProjects, fetchActivities, fetchMembers])
    .then(([adminRes, projectsRes, activitiesRes, memebersRes]) => {
      setAdmin(adminRes.data);
      setProjects(projectsRes.data);
      setActivityFeed(activitiesRes.data);
      setMembersList(memebersRes.data);

      // --- Calculate metrics ---
      const totalProjects = projectsRes.data.length;
      const totalActivities = activitiesRes.data.length;
      const activeTasks = activitiesRes.data.filter(a => a.action === "IN_PROGRESS" || a.action === "NOT_STARTED" ).length;
      const completedTasks = activitiesRes.data.filter(a => a.action === "COMPLETED").length;
      const teamMembers = memebersRes.data.length;
      console.log("Activites res-",activitiesRes.data);

      setMetrics([
        { label: "Total Projects", value: totalProjects, color: "#667eea" },
        { label: "Active Tasks", value: activeTasks, color: "#764ba2" },
        { label: "Completed Tasks", value: completedTasks, color: "#56cc9d" },
        { label: "Team Members", value: teamMembers, color: "#ff6b6b" },
      ]);
    })
    .catch((err) => {
      console.error("Dashboard data load error:", err);
      setMetrics(defaultMetrics);
    });

  }, [adminId, token]);

  if (!admin) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", bgcolor: "grey.50", minHeight: "100vh" }}>
      <CssBaseline />
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

      <Sidebar adminId={adminId} />

      <Box>
        <Toolbar />

        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <UserInfoCard user={admin.user} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      mb: 3,
                    }}
                  >
                    <Metrics metrics={metrics} />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    }}
                  >
                    <ProjectSummary />
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

export default AdminDashboard;
