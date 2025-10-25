import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const UserInfoCard = ({ user }) => {
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: 3, color: "#2c3e50" }}
      >
        User Information
      </Typography>
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar
          sx={{
            bgcolor: "linear-gradient(45deg, #667eea, #764ba2)",
            mr: 3,
            width: 64,
            height: 64,
            boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
          }}
        >
          <AdminPanelSettingsIcon sx={{ fontSize: 32 }} />
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#2c3e50" }}>
            {user?.name}
          </Typography>
          <Typography variant="body1" sx={{ color: "#7f8c8d", mt: 0.5 }}>
            {user?.email}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" gap={2} flexWrap="wrap">
        <Chip
          label={`Role: ${user?.role || "Admin"}`}
          sx={{
            background: "linear-gradient(45deg, #667eea, #764ba2)",
            color: "white",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        />
        <Chip
          label="Status: Active"
          sx={{
            background: "linear-gradient(45deg, #56cc9d, #6c5ce7)",
            color: "white",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        />
      </Box>
    </Box>
  );
};

export default UserInfoCard;
