import React, { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import axios from 'axios';

interface Version {
  id: number;
  chat_id: number;
  pdf_content: string;
  created_at?: string;
  version_number: number;
}

interface VersionSelectorModalProps {
  open: boolean;
  onClose: () => void;
  chatId: string;
  onSelect: (version: Version) => void;
}

const VersionSelectorModal: React.FC<VersionSelectorModalProps> = ({ open, onClose, chatId, onSelect }) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    axios.get(`/api/chat/${chatId}/versions`)
      .then(res => setVersions(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          // 403 means this is a shared chat - versions not available
          setError('Version history is not available for shared chats.');
        } else if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else {
          setError('Failed to load versions');
        }
      })
      .finally(() => setLoading(false));
  }, [open, chatId]);

  return (
    <Modal isOpen={open} onClose={onClose} title="Select a Version">
      <div className="space-y-4">
        {loading && <div>Loading versions...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {versions.map(v => (
              <li key={v.id}>
                <button
                  className="w-full text-left px-4 py-2 border border-blue-200 rounded hover:bg-blue-50"
                  onClick={() => onSelect(v)}
                >
                  Version #{v.version_number} {v.created_at ? `- ${new Date(v.created_at).toLocaleString()}` : ''}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
};

export default VersionSelectorModal;
