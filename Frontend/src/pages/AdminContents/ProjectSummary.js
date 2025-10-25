import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Container,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ProjectSummary = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'NOT_STARTED',
    startDate: '',
    endDate: '',
    members: [],
  });
  const [membersList, setMembersList] = useState([]);
  const userData = useAuth();
  const token = userData?.user?.token;
  const userId = userData?.user?.id;
  const backendBaseUrl = 'http://localhost:8080';

  useEffect(() => {
    axios
      .get(`${backendBaseUrl}/api/projects/projectByAdmin/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
        console.log(res.data)
      })
      .catch((err) => {
        console.error('Failed to fetch projects:', err);
        setLoading(false);
      });

    axios
      .get(`${backendBaseUrl}/api/admin/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setMembersList(res.data))
      .catch((err) => console.error('Failed to fetch members:', err));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMembersChange = (e) => {
    setNewProject((prev) => ({
      ...prev,
      members: e.target.value,
    }));
  };

  const handleCreateProject = () => {
    const payload = {
      ...newProject,
      createdBy: { id: userId },
      members: newProject.members.map((id) => ({ id })),
    };

    axios
      .post(`${backendBaseUrl}/api/projects`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProjects((prev) => [...prev, res.data]);
        setNewProject({
          title: '',
          description: '',
          status: 'NOT_STARTED',
          startDate: '',
          endDate: '',
          members: [],
        });
      })
      .catch((err) => console.error('Failed to create project:', err));
  };

  const handleUpdateStatus = (projectId, newStatus) => {
  const projectToUpdate = projects.find((p) => p.id === projectId);
  if (!projectToUpdate) return;

  const payload = {
    ...projectToUpdate,
    status: newStatus,
  };

  axios
    .put(`${backendBaseUrl}/api/projects/${projectId}`, payload, {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
    })
    .then((res) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? res.data : p))
      );
      console.log(res.data);
    })
    .catch((err) => console.error('Failed to update status:', err));
};


  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 3,
          background: 'linear-gradient(to right, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Project Summary Dashboard
      </Typography>

      {/* Create Project Form */}
      <Card
        elevation={4}
        sx={{
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f6f9fc, #e8f0fe)',
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
            Create New Project
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project Title"
                name="title"
                value={newProject.title}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={newProject.description}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={newProject.status}
                  onChange={handleChange}
                  input={<OutlinedInput label="Status" />}
                >
                  <MenuItem value="NOT_STARTED">Not Started</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                name="startDate"
                value={newProject.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                name="endDate"
                value={newProject.endDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Members</InputLabel>
                <Select
                  multiple
                  value={newProject.members}
                  onChange={handleMembersChange}
                  input={<OutlinedInput label="Members" />}
                  renderValue={(selected) =>
                    selected
                      .map(
                        (id) =>
                          membersList.find((member) => member.id === id)?.name ||
                          id
                      )
                      .join(', ')
                  }
                >
                  {membersList.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      <Checkbox
                        checked={newProject.members.includes(member.id)}
                      />
                      <ListItemText primary={member.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleCreateProject}
              fullWidth
              sx={{
                background: 'linear-gradient(to right, #56cc9d, #59c3c3)',
                fontWeight: 600,
                py: 1.2,
                fontSize: 16,
                '&:hover': {
                  background: 'linear-gradient(to right, #45b69c, #43b0b0)',
                },
              }}
            >
              Create Project
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Project Table */}
      <Card
        elevation={4}
        sx={{
          borderRadius: 4,
          background: 'linear-gradient(135deg, #ffffff, #f2f6fc)',
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: '#34495e', fontWeight: 600 }}
          >
            Project List
          </Typography>
          {loading ? (
            <CircularProgress sx={{ display: 'block', mx: 'auto', my: 5 }} />
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f1f3f9' }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Members</TableCell>
                </TableRow>
              </TableHead>
              {/* <TableBody>
                {projects.map((project) => (
                  <TableRow
                    key={project.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f0f4ff',
                      },
                    }}
                  >
                    <TableCell>{project.id}</TableCell>
                    <TableCell>{project.title}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          color:
                            project.status === 'COMPLETED'
                              ? '#2ecc71'
                              : project.status === 'IN_PROGRESS'
                              ? '#f1c40f'
                              : '#e74c3c',
                          fontWeight: 600,
                        }}
                      >
                        {project.status.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(project.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(project.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{project.createdBy?.name || 'Unknown'}</TableCell>
                    <TableCell>{project.members?.length || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody> */}
              {/* <TableBody>
  {projects.map((project) => (
    <TableRow
    key={project.id}
      sx={{
        '&:hover': {
          backgroundColor: '#f0f4ff',
        },
      }}
    >
      <TableCell>{project.id}</TableCell>
      <TableCell>{project.title}</TableCell>
      <TableCell>
        <FormControl fullWidth size="small">
          <Select
            value={project.status}
            onChange={(e) => {
              const newStatus = e.target.value;
              setProjects((prev) =>
                prev.map((p) =>
                  p.id === project.id ? { ...p, status: newStatus } : p
                )
              );
            }}
          >
            <MenuItem value="NOT_STARTED">Not Started</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          size="small"
          sx={{ mt: 0.5 }}
          onClick={() => handleUpdateStatus(project.id, project.status)}
        >
          Save
        </Button>
      </TableCell>
      <TableCell>
        {new Date(project.startDate).toLocaleDateString()}
      </TableCell>
      <TableCell>
        {new Date(project.endDate).toLocaleDateString()}
      </TableCell>
      <TableCell>{project.createdBy?.name || 'Unknown'}</TableCell>
      <TableCell>{project.members?.length || 0}</TableCell>
    </TableRow>
  ))}
</TableBody> */}
<TableBody>
  {projects.map((project) => (
    <TableRow
      key={project.id}
      sx={{
        '&:hover': {
          backgroundColor: '#f0f4ff',
        },
      }}
    >
      <TableCell>{project.id}</TableCell>
      <TableCell>{project.title}</TableCell>
      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          {/* Edit button on the left */}
          
          {/* Status dropdown */}
          <FormControl fullWidth size="small">
            <Select
              value={project.status}
              onChange={(e) => {
                const newStatus = e.target.value;
                setProjects((prev) =>
                  prev.map((p) =>
                    p.id === project.id ? { ...p, status: newStatus } : p
                  )
                );
              }}
            >
              <MenuItem value="NOT_STARTED">Not Started</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </Select>
          </FormControl>

        
          <Button
            variant="outlined"
            size="small"
             onClick={() => handleUpdateStatus(project.id, project.status)}
          >
            Edit
          </Button>

        </Box>
      </TableCell>
      <TableCell>
        {new Date(project.startDate).toLocaleDateString()}
      </TableCell>
      <TableCell>
        {new Date(project.endDate).toLocaleDateString()}
      </TableCell>
      <TableCell>{project.createdBy?.name || 'Unknown'}</TableCell>
      <TableCell>{project.members?.length || 0}</TableCell>
    </TableRow>
  ))}
</TableBody>

            </Table>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProjectSummary;
