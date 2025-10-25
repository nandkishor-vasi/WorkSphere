import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper,
  Typography,
  Divider,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FlagIcon from '@mui/icons-material/Flag';
import { useAuth } from '../../context/AuthContext';

const ProjectTimeline = ({ projectId }) => {
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendBaseUrl = "http://localhost:8080";
  const UserData = useAuth();
  const token = UserData?.user?.token;

  useEffect(() => {
    if (projectId) {
      axios.get(`${backendBaseUrl}/api/analytics/projects/${projectId}/timeline`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => setTimeline(res.data))
        .catch(err => console.error("Failed to fetch project timeline:", err))
        .finally(() => setLoading(false));
    }
  }, [projectId]);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" color="primary" gutterBottom>
        Project Timeline
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Project ID: {projectId}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {loading ? (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress />
        </Box>
      ) : !timeline ? (
        <Typography variant="body2" color="text.secondary">
          No timeline data available.
        </Typography>
      ) : (
        <List>
          <ListItem>
            <ListItemIcon><FlagIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Project Title" secondary={timeline.title} />
          </ListItem>
          <ListItem>
            <ListItemIcon><EventIcon color="action" /></ListItemIcon>
            <ListItemText primary="Start Date" secondary={new Date(timeline.start_date).toLocaleDateString()} />
          </ListItem>
          <ListItem>
            <ListItemIcon><EventIcon color="action" /></ListItemIcon>
            <ListItemText primary="End Date" secondary={new Date(timeline.end_date).toLocaleDateString()} />
          </ListItem>
          <ListItem>
            <ListItemIcon><AccessTimeIcon color="secondary" /></ListItemIcon>
            <ListItemText primary="Created At" secondary={new Date(timeline.created_at).toLocaleString()} />
          </ListItem>
          <ListItem>
            <ListItemIcon><ScheduleIcon color="success" /></ListItemIcon>
            <ListItemText primary="Duration (days)" secondary={timeline.duration_days} />
          </ListItem>
          <ListItem>
            <ListItemIcon><FlagIcon color="error" /></ListItemIcon>
            <ListItemText primary="Status" secondary={timeline.status} />
          </ListItem>
        </List>
      )}
    </Paper>
  );
};

export default ProjectTimeline;
