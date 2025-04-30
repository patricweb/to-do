import { useState } from 'react';
import CreateProject from './CreateProject';
import ProjectList from './ProjectList';

const ProjectPage = ({ user }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleProjectCreated = () => {
    setShowCreateForm(false);
  };

  return (
    <div>
      {showCreateForm ? (
        <CreateProject onProjectCreated={handleProjectCreated} />
      ) : (
        <ProjectList onNewProject={() => setShowCreateForm(true)} />
      )}
    </div>
  );
};

export default ProjectPage;