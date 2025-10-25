import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { TextField, Select, MenuItem, Button, InputLabel, FormControl, FormHelperText } from '@mui/material';

const ActivityForm = ({ adminId, refresh }) => {
  const userData = useAuth();
  const token = userData?.user?.token;
const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

  const [formData, setFormData] = useState({
    action: '',
    detail: '',
    timestamp: new Date().toISOString(),
    createdBy: '',
    handledBy: '',  
    project: '',  
  });

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);  

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${backendBaseUrl}/api/projects/projectByAdmin/${adminId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(res.data);  // Set the fetched projects
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [adminId, token]);

  // Fetch members based on the selected project
  useEffect(() => {
    if (formData.project) {
      const fetchMembers = async () => {
        try {
          const res = await axios.get(`${backendBaseUrl}/api/projects/availableMembers/${formData.project}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMembers(res.data); 
        } catch (error) {
          console.error("Error fetching members:", error);
        }
      };

      fetchMembers();
    } else {
      setMembers([]); 
    }
  }, [formData.project, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
        action: formData.action,
        detail: formData.detail,
        timestamp: formData.timestamp,
        createdBy: { id: parseInt(adminId, 10) }, 
        handledBy: { id: parseInt(formData.handledBy, 10) }, 
        project: { id: parseInt(formData.project, 10) },     
      };
    
    try {
        console.log("Payload:", payload); // Log the payload to check its structure
      await axios.post(`${backendBaseUrl}/api/activities`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refresh();
      setFormData({ action: '', detail: '', timestamp: new Date().toISOString(), createdBy: '', handledBy: '', project: '' });
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{
        padding: '20px', 
        width: '400px', 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        marginLeft: '20px', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      <FormControl fullWidth margin="normal">
        <InputLabel>Action</InputLabel>
        <Select
          name="action"
          value={formData.action}
          onChange={handleChange}
          required
          label="Action"
        >
          <MenuItem value="COMPLETED">Completed</MenuItem>
          <MenuItem value="NOT_STARTED">Not Started</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
        </Select>
      </FormControl>

      <TextField
        name="detail"
        label="Detail"
        placeholder="Detail"
        value={formData.detail}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />

      <TextField
        name="createdBy"
        label="Created By ID"
        value={adminId}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
        disabled
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Handled By</InputLabel>
        <Select
          name="handledBy"
          value={formData.handledBy}
          onChange={handleChange}
          required
          label="Handled By"
        >
          <MenuItem value="">Select Handled By (Member ID)</MenuItem>
          {members.map(member => (
            <MenuItem key={member.id} value={member.id}>
              {member.name} (ID: {member.id})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Project</InputLabel>
        <Select
          name="project"
          value={formData.project}
          onChange={handleChange}
          required
          label="Project"
        >
          <MenuItem value="">Select Project</MenuItem>
          {projects.map(project => (
            <MenuItem key={project.id} value={project.id}>
              {project.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Add Activity
      </Button>
    </form>
  );
};

export default ActivityForm;
