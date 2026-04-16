import { useState, useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import api from '../api/axios'; 
import HeaderMUI from '../components/HeaderMUI'; 
import Sidebar from '../components/Sidebar'; 
import MainContent from '../components/MainContent'; 
import ProjectForm from '../components/ProjectForm'; 
import styles from './Dashboard.module.css'; 
  
interface Project { id: string; name: string; color: string; } 
interface Column { id: string; title: string; tasks: string[]; } 
  
export default function Dashboard() { 
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const [projects, setProjects] = useState<Project[]>([]); 
  const [columns, setColumns] = useState<Column[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [showForm, setShowForm] = useState(false); 

  // GET — charger les données au montage 
  useEffect(() => { 
    async function fetchData() { 
      try { 
        const [projRes, colRes] = await Promise.all([ 
          api.get('/projects'), 
          api.get('/columns'), 
        ]); 
        
        setProjects(projRes.data); 
        setColumns(colRes.data); 
        console.log('Fetched projects:', projRes.data);
        console.log('Fetched columns:', colRes.data);
      } catch (e) { 
        console.error('Fetch error:', e); 
      } finally { 
        setLoading(false); 
      } 
    } 
    fetchData(); 
  }, []); 
  
  // POST — ajouter un projet 
  async function addProject(name: string, color: string) { 
    try { 
      const { data } = await api.post('/projects', { name, color }); 
      setProjects(prev => [...prev, data]); 
    } catch (err) { 
      console.error(err);
    } 
  } 
  
  // PUT — renommer un projet 
  async function renameProject(id: string, newName: string) {
    try {
      const { data } = await api.put('/projects/' + id, {
        name: newName
      });

      setProjects(prev =>
        prev.map(p => (p.id === id ? data : p))
      );
    } catch (err) {
      console.error(err);
    }
  }  
  
  // DELETE — supprimer un projet 
  async function deleteProject(id: string) {
    if (!confirm("Êtes-vous sûr ?")) return;

    try {
      await api.delete('/projects/' + id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div className={styles.loading}>Chargement...</div>; 
  

  return ( 
    <div className={styles.layout}> 

      <HeaderMUI 
        title="TaskFlow" 
        onMenuClick={() => setSidebarOpen(p => !p)} 
        userName={authState.user?.name} 
        onLogout={() => dispatch(logout())} 
      /> 

      <div className={styles.body}> 
        <Sidebar
          projects={projects}
          isOpen={sidebarOpen}
          onRename={renameProject}
          onDelete={deleteProject}
        />

        <div className={styles.content}> 
          <div className={styles.toolbar}> 
            {!showForm ? ( 
              <button 
                className={styles.addBtn} 
                onClick={() => setShowForm(true)}
              > 
                + Nouveau projet 
              </button> 
            ) : ( 
              <ProjectForm 
                submitLabel="Créer" 
                onSubmit={(name, color) => { 
                  addProject(name, color); 
                  setShowForm(false); 
                }} 
                onCancel={() => setShowForm(false)} 
              /> 
            )} 
          </div> 

          <MainContent columns={columns} /> 
        </div> 
      </div> 
    </div> 
  ); 
}