import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  LinearProgress,
  Tooltip,
  Paper,
  Button
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";


const ProjectList = () => {
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const userId = userData?.id;
  const token = userData?.token;
  const backendBaseUrl = "http://localhost:8080";
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    axios
      .get(`${backendBaseUrl}/api/projects/projectByMember/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects.");
        setLoading(false);
      });
  }, [userId, token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={250}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 3 }}>
        No projects assigned yet.
      </Typography>
    );
  }

   const columns = [
    {
      field: "title",
      headerName: "Activity Title",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Typography fontWeight={600}>{params.value || "Untitled"}</Typography>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1.5,
      minWidth: 240,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {params.value || "—"}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 140,
      renderCell: (params) => (
        <Chip
          label={
            params.value === "IN_PROGRESS"
              ? "In Progress"
              : params.value === "COMPLETED"
              ? "Completed"
              : "Pending"
          }
          color={
            params.value === "COMPLETED"
              ? "success"
              : params.value === "IN_PROGRESS"
              ? "primary"
              : "default"
          }
          size="small"
        />
      ),
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 0.8,
      minWidth: 150,
      renderCell: (params) =>
        params.value ? (
          <Typography variant="body2" color="text.secondary">
            {new Date(params.value).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        ),
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 0.8,
      minWidth: 150,
      renderCell: (params) =>
        params.value ? (
          <Typography variant="body2" color="text.secondary">
            {new Date(params.value).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        ),
    },
    {
    field: "activities",
    headerName: "Activities",
    flex: 0.6,
    minWidth: 140,
    renderCell: (params) => (
      <Button
        variant="contained"
        size="small"
        onClick={() =>
          navigate(`/member/${userData?.id}/activity`, { state: { projectId: params.row.id } })
        }
      >
        View
      </Button>
    ),
  },
  ];

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        m: 2,
        borderRadius: 3,
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        mb={2}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          ml: 1,
        }}
      >
        Assigned Projects
      </Typography>

      <Box
        sx={{
          height: 480,
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 2,
          overflow: "hidden",
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f3f4f6",
            color: "#374151",
            fontWeight: 600,
            borderBottom: "1px solid #e5e7eb",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #f1f1f1",
            display: "flex",
            alignItems: "center",
            textAlign: "center",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#eef2ff",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#fafafa",
            borderTop: "1px solid #e0e0e0",
          },
        }}
      >
        <DataGrid
          rows={projects.map((proj, idx) => ({ id: proj.id || idx, ...proj }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          disableSelectionOnClick
        />
      </Box>
    </Paper>
  );
};

export default ProjectList;
