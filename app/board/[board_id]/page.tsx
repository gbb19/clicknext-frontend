"use client";

import {
  fetchColumns,
  createColumn,
  moveColumn,
  fetchTasksByColumn,
  createTask,
  moveTask,
} from "@/lib/apis/api";
import { Column } from "@/types/column";
import { Task, CreateTask } from "@/types/task";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GradientButton from "@/components/gradeint-button";
import Modal from "@/components/Modal";

export default function BoardDetailPage() {
  const params = useParams<{ board_id: string }>();
  const board_id = Number(params.board_id);

  // State for columns and tasks
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Record<number, Task[]>>({});

  // Modal states
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Form states
  const [columnName, setColumnName] = useState("");
  const [taskForm, setTaskForm] = useState<CreateTask>({
    name: "",
    due_date: "",
    start_date: "",
    column_id: 0,
  });

  // UI states
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load columns and their tasks
  const loadColumns = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchColumns(board_id);
      const safeData = Array.isArray(data) ? data : [];
      const sortedColumns = safeData.sort((a, b) => a.position - b.position);
      setColumns(sortedColumns);

      await Promise.all(
        sortedColumns.map((column) => loadTasks(column.column_id))
      );
    } catch (error) {
      console.error("Failed to load columns:", error);
      setError("Failed to load board data");
    } finally {
      setIsLoading(false);
    }
  };

  // Load tasks for a specific column
  const loadTasks = async (columnId: number) => {
    try {
      const data = await fetchTasksByColumn(columnId);
      const safeData = Array.isArray(data) ? data : [];
      setTasks((prev) => ({
        ...prev,
        [columnId]: safeData.sort((a, b) => a.position - b.position),
      }));
    } catch (error) {
      console.error(`Failed to load tasks for column ${columnId}:`, error);
      setTasks((prev) => ({ ...prev, [columnId]: [] }));
    }
  };

  useEffect(() => {
    if (board_id) {
      loadColumns();
    }
  }, [board_id]);

  // Column creation handler
  const handleCreateColumn = async () => {
    if (!columnName.trim()) return;

    try {
      const newColumn = await createColumn({ board_id, name: columnName });
      setColumns((prev) => [...prev, newColumn]);
      setIsColumnModalOpen(false);
      setColumnName("");
      await loadTasks(newColumn.column_id);
    } catch (error) {
      console.error("Failed to create column:", error);
      setError("Failed to create column");
    }
  };

  // Task creation handler
  const handleCreateTask = async () => {
    if (!selectedColumnId || !taskForm.name.trim()) return;

    try {
      // ใช้ .toISOString() เพื่อให้ได้รูปแบบวันที่ที่ต้องการ
      const completeTaskData: CreateTask = {
        ...taskForm,
        column_id: selectedColumnId,
        due_date: taskForm.due_date
          ? new Date(taskForm.due_date).toISOString() // แปลงวันที่ให้เป็น ISO format
          : new Date().toISOString(),
        start_date: taskForm.start_date
          ? new Date(taskForm.start_date).toISOString() // แปลงวันที่ให้เป็น ISO format
          : new Date().toISOString(),
      };

      const newTask = await createTask(completeTaskData);

      setTasks((prev) => ({
        ...prev,
        [selectedColumnId]: [...(prev[selectedColumnId] || []), newTask].sort(
          (a, b) => a.position - b.position
        ),
      }));

      setIsTaskModalOpen(false);
      setTaskForm({
        name: "",
        due_date: "",
        start_date: "",
        column_id: 0,
      });
      setSelectedColumnId(null);
    } catch (error) {
      console.error("Failed to create task:", error);
      setError("Failed to create task");
    }
  };

  const handleColumnDrop = async (
    e: React.DragEvent,
    targetColumnId: number
  ) => {
    e.preventDefault();
    const draggedColumnId = parseInt(e.dataTransfer.getData("columnId"));

    if (draggedColumnId !== targetColumnId) {
      const newColumns = [...columns];
      const draggedColumnIndex = newColumns.findIndex(
        (col) => col.column_id === draggedColumnId
      );
      const targetColumnIndex = newColumns.findIndex(
        (col) => col.column_id === targetColumnId
      );

      if (draggedColumnIndex === -1 || targetColumnIndex === -1) return;

      [newColumns[draggedColumnIndex], newColumns[targetColumnIndex]] = [
        newColumns[targetColumnIndex],
        newColumns[draggedColumnIndex],
      ];
      setColumns(newColumns);

      try {
        await moveColumn(draggedColumnId, board_id, targetColumnIndex + 1);
        loadColumns();
      } catch (error) {
        console.error("Error moving column:", error);
        setColumns(columns);
        setError("Failed to move column");
      }
    }
  };

  // Task drag and drop handlers
  const handleTaskDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("taskId", taskId.toString());
    e.dataTransfer.setData(
      "sourceColumnId",
      e.currentTarget
        .closest("[data-column-id]")
        ?.getAttribute("data-column-id") || ""
    );
  };

  const handleTaskDrop = async (
    e: React.DragEvent,
    targetColumnId: number,
    targetPosition?: number
  ) => {
    e.preventDefault();
    const draggedTaskId = parseInt(e.dataTransfer.getData("taskId"));
    const sourceColumnId = parseInt(e.dataTransfer.getData("sourceColumnId"));

    if (isNaN(draggedTaskId) || isNaN(sourceColumnId)) return;

    if (typeof targetPosition === "undefined") {
      targetPosition = tasks[targetColumnId]
        ? tasks[targetColumnId].length + 1
        : 1;
    }

    try {
      await moveTask(draggedTaskId, targetPosition);

      setTasks((prev) => {
        const newTasks = { ...prev };
        const sourceTasks = newTasks[sourceColumnId] || [];

        // Find and remove the dragged task
        const draggedTaskIndex = sourceTasks.findIndex(
          (t) => t.task_id === draggedTaskId
        );
        if (draggedTaskIndex === -1) return prev;

        const [draggedTask] = sourceTasks.splice(draggedTaskIndex, 1);
        newTasks[sourceColumnId] = sourceTasks;

        // Add to target column
        const targetTasks = newTasks[targetColumnId] || [];
        const newTask = { ...draggedTask, column_id: targetColumnId };

        // Insert at the target position
        targetTasks.splice(targetPosition - 1, 0, newTask);

        // Update positions
        newTasks[targetColumnId] = targetTasks.map((task, index) => ({
          ...task,
          position: index + 1,
        }));

        return newTasks;
      });

      setDragOverTaskId(null);
    } catch (error) {
      console.error("Error moving task:", error);
      setError("Failed to move task");
      loadTasks(sourceColumnId);
      if (sourceColumnId !== targetColumnId) {
        loadTasks(targetColumnId);
      }
    }
  };

  const handleTaskDropOnTask = (
    e: React.DragEvent,
    targetTaskId: number,
    targetColumnId: number
  ) => {
    e.preventDefault();
    const targetTask = tasks[targetColumnId]?.find(
      (task) => task.task_id === targetTaskId
    );
    if (targetTask) {
      handleTaskDrop(e, targetColumnId, targetTask.position);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8 min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading board...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="text-xl text-red-500 mb-4">{error}</div>
        <GradientButton text="Retry" onClick={loadColumns} />
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-black">Board {board_id}</h1>
        <GradientButton
          text="Add Column"
          onClick={() => setIsColumnModalOpen(true)}
        />
      </div>

      {columns.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg mb-4">No columns found</p>
          <GradientButton
            text="Create First Column"
            onClick={() => setIsColumnModalOpen(true)}
          />
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div
              key={column.column_id}
              className="min-w-[300px] bg-white p-4 rounded-lg shadow-md flex flex-col"
              style={{ backgroundColor: column.color || "#ffffff" }}
              draggable
              onDragStart={(e) => handleColumnDragStart(e, column.column_id)}
              onDrop={(e) => handleColumnDrop(e, column.column_id)}
              onDragOver={(e) => e.preventDefault()}
              data-column-id={column.column_id}
            >
              <div className="flex justify-between items-center mb-3">
                <h2
                  className="font-bold text-lg"
                  style={{ color: column.text_color || "#000000" }}
                >
                  {column.name}
                </h2>
                <button
                  onClick={() => {
                    setSelectedColumnId(column.column_id);
                    setTaskForm((prev) => ({
                      ...prev,
                      column_id: column.column_id,
                    }));
                    setIsTaskModalOpen(true);
                  }}
                  className="text-black bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full w-6 h-6 flex items-center justify-center"
                  style={{ color: column.text_color || "#000000" }}
                >
                  +
                </button>
              </div>

              <div
                className="flex flex-col gap-2 flex-grow min-h-[100px]"
                onDrop={(e) => handleTaskDrop(e, column.column_id)}
                onDragOver={(e) => e.preventDefault()}
              >
                {tasks[column.column_id]?.map((task) => (
                  <div
                    key={task.task_id}
                    className={`bg-white p-3 rounded shadow-sm cursor-move transition-all mb-2 ${
                      dragOverTaskId === task.task_id
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                    draggable
                    onDragStart={(e) => handleTaskDragStart(e, task.task_id)}
                    onDrop={(e) =>
                      handleTaskDropOnTask(e, task.task_id, column.column_id)
                    }
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverTaskId(task.task_id);
                    }}
                    onDragLeave={() => setDragOverTaskId(null)}
                  >
                    <div className="font-medium">{task.name}</div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>
                        {task.start_date &&
                          new Date(task.start_date).toLocaleDateString()}
                      </span>
                      <span>
                        {task.due_date &&
                          new Date(task.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Created: {new Date(task.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}

                {(!tasks[column.column_id] ||
                  tasks[column.column_id].length === 0) && (
                  <div
                    className="flex-grow min-h-[100px] border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400"
                    onDragOver={(e) => e.preventDefault()}
                  >
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Column Creation Modal */}
      <Modal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
      >
        <h2 className="text-xl text-center font-bold mb-4">Create Column</h2>
        <input
          type="text"
          className="p-2 border rounded w-full mb-4"
          placeholder="Column Name"
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateColumn()}
        />
        <GradientButton
          text="Create"
          onClick={handleCreateColumn}
          disabled={!columnName.trim()}
        />
      </Modal>

      {/* Task Creation Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedColumnId(null);
          setTaskForm({
            name: "",
            due_date: "",
            start_date: "",
            column_id: 0,
          });
        }}
      >
        <h2 className="text-xl text-center font-bold mb-4">Create Task</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Task Name*</label>
            <input
              type="text"
              className="p-2 border rounded w-full"
              value={taskForm.name}
              onChange={(e) =>
                setTaskForm({ ...taskForm, name: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="p-2 border rounded w-full"
                value={taskForm.start_date}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, start_date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                className="p-2 border rounded w-full"
                value={taskForm.due_date}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, due_date: e.target.value })
                }
              />
            </div>
          </div>

          <GradientButton
            text="Create Task"
            onClick={handleCreateTask}
            disabled={!taskForm.name.trim()}
          />
        </div>
      </Modal>
    </div>
  );
}
