"use client";
import BoardCard from "@/components/BoardCard";
import GradientButton from "@/components/gradeint-button";
import Modal from "@/components/Modal";
import { fetchMyBoards, createBoard } from "@/lib/apis/api";
import { Board } from "@/types/board";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BoardPage() {
  const router = useRouter();
  const [createdBoards, setCreatedBoards] = useState<Board[]>([]);
  const [joinedBoards, setJoinedBoards] = useState<Board[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
  };

  const loadBoards = async () => {
    const data = await fetchMyBoards();
    if (data.created_boards) setCreatedBoards(data.created_boards);
    if (data.joined_boards) setJoinedBoards(data.joined_boards);
  };

  useEffect(() => {
    loadBoards();
  }, []);

  const handleBoardClick = (id: number) => {
    router.push(`/board/${id}`);
  };

  const handleCreateBoard = async () => {
    try {
      const newBoard = await createBoard({ title, description });
      setCreatedBoards((prev) => [...prev, newBoard]); // เพิ่มเข้า list เลย
      closeModal();
    } catch (error) {
      console.error("Failed to create board:", error);
    }
  };

  return (
    <div className="bg-white min-h-screen w-full p-8 flex flex-col">
      <div className="flex gap-4 justify-end">
        <GradientButton text="Create Board" width="w-40" onClick={openModal} />
      </div>

      <h1 className="text-2xl font-bold my-4 text-black">My Boards</h1>

      <div className="grid grid-cols-3 gap-8 overflow-auto py-6">
        {/* แสดง Created Boards */}
        {createdBoards.length > 0 &&
          createdBoards.map((board) => (
            <BoardCard
              key={board.board_id}
              board_id={board.board_id}
              title={board.title}
              description={board.description}
              created_by={board.created_by}
              created_at={board.created_at}
              updated_at={board.updated_at}
              onClick={handleBoardClick}
              color="green"
            />
          ))}

        {/* แสดง Joined Boards */}
        {joinedBoards.length > 0 &&
          joinedBoards.map((board) => (
            <BoardCard
              key={board.board_id}
              board_id={board.board_id}
              title={board.title}
              description={board.description}
              created_by={board.created_by}
              created_at={board.created_at}
              updated_at={board.updated_at}
              onClick={handleBoardClick}
              color="blue"
            />
          ))}

        {/* กรณีไม่มี board */}
        {createdBoards.length === 0 && joinedBoards.length === 0 && (
          <p className="text-gray-500 col-span-3 text-center">
            No boards yet 😢
          </p>
        )}
      </div>

      {/* Modal สำหรับสร้าง Board */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex w-full items-center justify-between text-gray-800">
          <h2 className="flex-grow text-center text-2xl text-gray-800">
            Create Board
          </h2>
        </div>
        <div className="flex h-full w-full flex-col gap-4 text-black mt-4">
          <input
            type="text"
            className="p-2 border rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="p-2 border rounded"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <GradientButton text="Create" onClick={handleCreateBoard} />
        </div>
      </Modal>
    </div>
  );
}
