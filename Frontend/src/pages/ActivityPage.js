import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ActivityForm from '../components/ActivityForm';
import ActivityList from '../components/ActivityList';
import { useAuth } from '../context/AuthContext';
import { Grid, Paper, Box, Typography } from '@mui/material';

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const userData = useAuth();
  const adminId = userData?.user?.id;
  const token = userData?.user?.token;
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
  

  const fetchActivities = async () => {
    if (!adminId) return;
    const res = await axios.get(`${backendBaseUrl}/api/activities/admin/${adminId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setActivities(res.data);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Activities
      </Typography>

      <Grid container spacing={4}>
        {/* Activity Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3 }}>
            <ActivityForm adminId={adminId} refresh={fetchActivities} />
          </Paper>
        </Grid>

        {/* Activity List */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: '20px', borderRadius: '8px', boxShadow: 3 }}>
            <ActivityList activities={activities} refresh={fetchActivities} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ActivityPage;
