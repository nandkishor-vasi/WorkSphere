import React from 'react';
import ActivitiesCountPerProject from './ActivitiesCountPerProject';
import ActivityTimelineForProject from './ActivityTimelineForProject';
import { useAuth }  from '../../context/AuthContext';
import axios from 'axios';
import { useEffect, useState } from 'react';


const AnalyticsFeed = () => {
  const [projects, setProjects] = useState([]);
  const userData = useAuth();
  const token = userData?.user?.token;
  const adminId = userData?.user?.id;
  const backendBaseUrl = "http://localhost:8080";
  
  useEffect(() => {
    axios.get(`${backendBaseUrl}/api/projects/projectByAdmin/${adminId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setProjects(res.data);
      })
      .catch(err => console.error("Failed to fetch projects:", err));
  }, [token, adminId]);
  
  return (
    <div>
      <ActivitiesCountPerProject projects={projects} />

      {projects.map((project) => (
        <ActivityTimelineForProject key={project.id} projectId={project.id} />
      ))}
    </div>
  );
};

export default AnalyticsFeed;
