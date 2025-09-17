import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./screens/Home";
import Contact from "./screens/Contact";
import Properties from "./screens/Properties"; // Updated import path
import About from "./screens/About"; // Updated import path
import PropertyDetails from "./screens/PropertyDetails";
import Projects from "./screens/Projects";
import ProjectDetails from "./screens/ProjectDetails";
import Admin from "./screens/admin";
import ScrollToTop from "./components/ScrollToTop";
import PageNotFound from "./screens/PageNotFound";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/about" element={<About />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

