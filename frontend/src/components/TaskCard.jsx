function TaskCard({ task, onStatusChange }) {
    const priorityColors = {
        low: "border-green-400",
        medium: "border-blue-400",
        high: "border-red-400",
    };

    return (
        <div className={`bg-white p-4 rounded shadow border-l-4 ${priorityColors[task.priority]} flex justify-between items-center`}>
            <div>
                <h2 className="text-lg font-semibold">{task.title}</h2>
                <div className="text-sm text-gray-500">
                    Приоритет: <span className="capitalize">{task.priority}</span>
                    {task.dueDate && (
                        <span> | Срок: {new Date(task.dueDate).toLocaleDateString()}</span>
                    )}
                </div>
            </div>
            {task.completed && <span className="text-green-500 text-2xl">✓</span>}
        </div>
    );
}

export default TaskCard;