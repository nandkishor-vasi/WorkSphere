import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

const Metrics = ({ metrics = [] }) => {
  const defaultMetrics = [
    { label: "Total Projects", value: "0", color: "#667eea" },
    { label: "Active Tasks", value: "0", color: "#764ba2" },
    { label: "Completed", value: "0", color: "#56cc9d" },
    { label: "Team Members", value: "0", color: "#ff6b6b" },
  ];

  const displayMetrics = metrics.length > 0 ? metrics : defaultMetrics;

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: 3, color: "#2c3e50" }}
      >
        Dashboard Metrics
      </Typography>
      <Grid container spacing={3}>
        {displayMetrics.map((metric, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                background: `linear-gradient(135deg, ${metric.color || "#667eea"}, ${metric.color || "#764ba2"})`,
                color: "white",
                borderRadius: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: `0 10px 25px ${metric.color || "#667eea"}40`,
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  {metric.value}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, opacity: 0.9 }}
                >
                  {metric.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Metrics;
