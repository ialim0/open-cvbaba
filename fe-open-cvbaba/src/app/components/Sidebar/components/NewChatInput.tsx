import React from 'react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';


interface NewChatInputProps {
  newChatTitle: string;
  setNewChatTitle: (title: string) => void;
  handleCreateChat: () => void;
  setIsCreating: (isCreating: boolean) => void;
}

const NewChatInput: React.FC<NewChatInputProps> = ({
  newChatTitle,
  setNewChatTitle,
  handleCreateChat,
  setIsCreating,
}) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
      <Input
        type="text"
        value={newChatTitle}
        onChange={(e: { target: { value: string; }; }) => setNewChatTitle(e.target.value)}
        className="mb-2 w-full"
        placeholder="Enter new ZenCV title"
      />
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => setIsCreating(false)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateChat}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default NewChatInput;
