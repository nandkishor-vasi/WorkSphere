import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Box,
  Chip,
  CircularProgress,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EditIcon from "@mui/icons-material/Edit";

const ActivityList = () => {
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const memberId = userData?.id;
  const token = userData?.token;
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;


  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [newAction, setNewAction] = useState("");

  useEffect(() => {
    if (!memberId || !token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          `${backendBaseUrl}/api/activities/member/${memberId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setActivities(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch activities.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [memberId, token]);

  const openEditDialog = (activity) => {
    setSelectedActivity(activity);
    setNewAction(activity.action);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setSelectedActivity(null);
    setEditDialogOpen(false);
  };

  const handleEditSubmit = async () => {
    if (!selectedActivity) return;

     const updatedData = {
    action: newAction, 
    };  

    try {
      const response = await axios.put(
        `${backendBaseUrl}/api/activities/${selectedActivity.id}`, updatedData, 
        { headers: { Authorization: `Bearer ${token}` }}
      );

      setActivities((prev) =>
        prev.map((a) => (a.id === selectedActivity.id ? response.data : a))
      );
      closeEditDialog();
    } catch (error) {
      console.error("Failed to update activity:", error);
      alert("Failed to update activity. Check your permissions or token.");
    }
  };

  const formatDate = (ts) => new Date(ts).toLocaleString();

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={3}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" mt={2}>
        {error}
      </Typography>
    );

  if (!activities || activities.length === 0)
    return (
      <Typography variant="body1" color="text.secondary">
        No activities assigned yet.
      </Typography>
    );

  return (
    <Box px={2} py={1}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Assigned Activities
      </Typography>
      <List>
        {activities.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ListItem
              sx={{
                bgcolor: "#f3f4f6",
                borderRadius: 3,
                mb: 2,
                p: 2,
                boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                transition: "0.2s",
                "&:hover": { bgcolor: "#e0e7ff", transform: "scale(1.02)" },
              }}
            >
              <Box display="flex" width="100%" justifyContent="space-between">
                <Box display="flex" alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "#4f46e5" }}>
                      <AssignmentIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <Box ml={2}>
                    <Typography fontWeight={600} variant="subtitle1">
                      {activity.project?.title || "Untitled Project"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mt={0.5}
                    >
                      {activity.detail || "No description available."}
                    </Typography>
                    <Stack direction="row" spacing={1} mt={0.5}>
                      <Chip
                        label={`Action: ${
                          activity.action === "NOT_STARTED"
                            ? "Not Started"
                            : activity.action === "IN_PROGRESS"
                            ? "In Progress"
                            : "Completed"
                        }`}
                        color={
                          activity.action === "COMPLETED"
                            ? "success"
                            : activity.action === "IN_PROGRESS"
                            ? "warning"
                            : "default"
                        }
                        size="small"
                      />
                      <Chip
                        label={`Project Status: ${
                          activity.project?.status || "N/A"
                        }`}
                        size="small"
                        color="info"
                      />
                    </Stack>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Timestamp: {formatDate(activity.timestamp)}
                    </Typography>
                  </Box>
                </Box>

                {/* Edit Button */}
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <Button
                    startIcon={<EditIcon />}
                    size="small"
                    variant="outlined"
                    onClick={() => openEditDialog(activity)}
                  >
                    Edit
                  </Button>
                </Box>
              </Box>
            </ListItem>
            {index < activities.length - 1 && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </List>

      {/* Edit Activity Dialog */}
      <Dialog open={editDialogOpen} onClose={closeEditDialog}>
        <DialogTitle>Edit Activity Action</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="action-label">Action</InputLabel>
            <Select
              labelId="action-label"
              value={newAction}
              label="Action"
              onChange={(e) => setNewAction(e.target.value)}
            >
              <MenuItem value="NOT_STARTED">Not Started</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActivityList;
