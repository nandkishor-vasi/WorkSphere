import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Paper, Typography, Divider, Box, CircularProgress, Stack } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const ActivitiesCountPerProject = ({ projects }) => {
  const [activitiesCount, setActivitiesCount] = useState({});
  const [loading, setLoading] = useState(true);
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
  const userData = useAuth();
  const token = userData?.user?.token;
  const adminId = userData?.user?.id;

  useEffect(() => {
    const fetchCounts = async () => {
      const counts = {};
      for (const project of projects) {
        try {
          const res = await axios.get(`${backendBaseUrl}/api/analytics/activities/${project.id}/count-per-project`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          counts[project.id] = res.data.length || 0;
        } catch (err) {
          console.error(`Failed to fetch activity count for project ${project.id}:`, err);
        }
      }
      setActivitiesCount(counts);
      setLoading(false);
    };

    if (projects.length > 0) {
      fetchCounts();
    }
  }, [projects]);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Activities Count Per Project
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          {projects.map((project, index) => (
            <Box key={project.id} sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 1, boxShadow: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {project.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Activities: {activitiesCount[project.id] ?? 0}
              </Typography>
              {index !== projects.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
};

export default ActivitiesCountPerProject;
