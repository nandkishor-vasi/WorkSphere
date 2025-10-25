import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleRedirect = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800">
      <div className="parallax">
        <div className="overlay">
          <motion.h2
            className="parallax-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to WorkSphere
          </motion.h2>
          <motion.p
            className="parallax-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            WorkSphere – Streamlining progress, one task at a time.
          </motion.p>
          <motion.button
            className="donate-btn"
            whileHover={{ scale: 1.1 }}
            onClick={handleRedirect}
          >
            Get Started
          </motion.button>
        </div>
      </div>

      <section className="section">
        <h3 className="title">Our Mission</h3>
        <p className="content">
          Our mission is to provide teams with a streamlined, intuitive platform
          to manage tasks, collaborate efficiently, and track progress with
          ease. We aim to simplify the project management process, enabling
          teams to focus on what truly matters—delivering quality results on
          time.
        </p>
      </section>

      <section className="section how-it-works">
        <h3 className="title">How It Works</h3>
        <div className="steps">
          {[
            {
              title: "Create & Manage Projects",
              description:
                "As a Admin you have the ability to create new projects, set up team structures, and define clear goals and milestones.",
            },
            {
              title: "Join a Project",
              description:
                "As a member, you’ll receive an invitation to join a project. Upon joining, you’ll be able to see the project’s objectives, your assigned tasks, and the overall timeline. ",
            },
            {
              title: "Assign Tasks",
              description:
                "Admins have full visibility of task completion, ensuring projects stay on track. ",
            },
          ].map((step, index) => (
            <motion.div
              key={step.title}
              className="step"
              whileHover={{ scale: 1.05 }}
              onClick={handleRedirect}
            >
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer id="contact-section" className="footer">
        <div className="contact-info">
          <h3>Contact Us</h3>
          <p>Email: nandkishorvasi@gmail.com</p>
          <p>Address: PCCOE Akurdi, Pune - 44</p>
        </div>
        <p className="copyright">
          © {new Date().getFullYear()} Retech. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
