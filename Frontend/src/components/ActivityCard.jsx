import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';

const ActivityCard = ({ activity, refresh }) => {
  const userData = useAuth();
  const token = userData?.user?.token;
  
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

  const handleDelete = async () => {
    await axios.delete(`${backendBaseUrl}/api/activities/${activity.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    refresh();
  };

  return (
    <Card
      style={{
        width: '100%',
        maxWidth: '400px',
        margin: '15px auto',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fafafa',
      }}
    >
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          {activity.action}
        </Typography>

        <Typography variant="body1" gutterBottom>
          {activity.detail}
        </Typography>

        <Box>
          <Chip label={`Created by ID: ${activity.createdBy?.id}`} color="primary" size="small" style={{ marginRight: '5px' }} />
          <Chip label={`Handled by ID: ${activity.handledBy?.id}`} color="secondary" size="small" style={{ marginRight: '5px' }} />
          <Chip label={`Project ID: ${activity.project?.id}`} color="default" size="small" />
        </Box>

        <Typography variant="caption" color="textSecondary" display="block" style={{ marginTop: '10px' }}>
          {new Date(activity.timestamp).toLocaleString()}
        </Typography>

        <Button
          onClick={handleDelete}
          variant="outlined"
          color="error"
          fullWidth
          style={{
            marginTop: '15px',
            borderRadius: '20px',
            fontWeight: 'bold',
          }}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
