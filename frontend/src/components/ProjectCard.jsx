function ProjectCard({ project, onClick }) {
    return (
        <div className="bg-white p-4 rounded shadow hover:shadow-lg cursor-poiner transition" onClick={onClick}>
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="text-sm text-gray-500 mt-1">Проект ID: {project._id}</p>
        </div>
    )
}

export default ProjectCard