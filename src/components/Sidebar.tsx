import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
interface Project {
  id: string;
  name: string;
  color: string;
}
interface SidebarProps {
  projects: Project[];
  isOpen: boolean;
  onRename?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
}
export default function Sidebar({ projects, isOpen, onRename, onDelete }: SidebarProps) {
  console.log("Sidebar re-Render")
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleRenameClick = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveRename = (id: string) => {
    if (editName.trim() && onRename) {
      onRename(id, editName.trim());
      setEditingId(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      if (onDelete) {
        onDelete(id);
      }
    }
  };

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      <h2 className={styles.title}>Mes Projets</h2>
      <ul className={styles.list}>
        {projects.map(p => (
          <li key={p.id} className={styles.projectItem}>
            {editingId === p.id ? (
              <div className={styles.editContainer}>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className={styles.editInput}
                  autoFocus
                />
                <button
                  onClick={() => handleSaveRename(p.id)}
                  className={styles.editBtn}
                  title="Enregistrer"
                >
                  ✓
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className={styles.cancelBtn}
                  title="Annuler"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className={styles.projectContent}>
                <NavLink
                  to={`/projects/${p.id}`}
                  className={({ isActive }) =>
                    `${styles.item} ${isActive ? styles.active : ''}`
                  }
                >
                  <span className={styles.dot} style={{ background: p.color }} />
                  {p.name}
                </NavLink>
                <div className={styles.actions}>
                  <button
                    onClick={() => handleRenameClick(p.id, p.name)}
                    className={styles.actionBtn}
                    title="Renommer"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDeleteClick(p.id)}
                    className={styles.deleteBtn}
                    title="Supprimer"
                  >
                    🗑
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
