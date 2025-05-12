import { useParams } from 'react-router-dom';
import TaskManager from './TaskManager';
import { BackButton } from '@vkruglikov/react-telegram-web-app';

const TasksPage = ({ user }) => {
  const { id } = useParams();

  return (
    <div>
      <BackButton onClick={() => window.history.back()} />
      <TaskManager projectId={id} />
    </div>
  );
};

export default TasksPage;