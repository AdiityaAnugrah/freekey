import React from "react";
import "./TaskCard.scss";

const TaskCard = ({ task, onComplete }) => {
    return (
        <div
            className={`p-6 rounded-lg shadow-lg mb-4 transition-all duration-300 ${
                task.completed ? "bg-green-200" : "bg-white"
            }`}
        >
            <h3 className="text-xl font-semibold mb-2">{task.name}</h3>
            <p className="text-gray-700 mb-4">{task.description}</p>

            <button
                onClick={() => onComplete(task.id)}
                className={`${
                    task.completed ? "bg-gray-400" : "bg-blue-500"
                } text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all`}
                disabled={task.completed}
            >
                {task.completed ? "Tugas Selesai" : "Selesaikan Tugas"}
            </button>

            {task.link && !task.completed && (
                <a
                    href={task.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4 text-blue-600 underline"
                >
                    Klik untuk subscribe ke channel YouTube
                </a>
            )}
        </div>
    );
};

export default TaskCard;
