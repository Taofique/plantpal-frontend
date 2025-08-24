import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActivityFullList from "../components/ActivityFullList";

export default function ActivityFullListPage() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
    navigate("/plants"); // <-- go back to PlantView
  };

  return <ActivityFullList isOpen={isOpen} onClose={handleClose} />;
}
