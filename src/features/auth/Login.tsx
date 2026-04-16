import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import styles from './Login.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../../store';
import { loginStart, loginSuccess, loginFailure } from './authSlice';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    // const { state, dispatch } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state: RootState) => state.auth);



    const from = (location.state as any)?.from || '/dashboard';

    useEffect(() => {
        console.log('useEffect triggered, user:', user);
        if (user) {
            console.log('Redirecting to dashboard');
            try {
                navigate('/dashboard', { replace: true });
            } catch (e) {
                console.error('Navigate error:', e);
            }
        }
    }, [user, navigate]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log('Submitting login');
        dispatch(loginStart());
        try {
            const { data: users } = await api.get(`/users?email=${email}`);
            console.log('Users found:', users);
            if (users.length === 0 || users[0].password !== password) {
                console.log('Invalid credentials');
                dispatch(loginFailure('Email ou mot de passe incorrect'));
                return;
            }
            const { password: _, ...userData } = users[0];
            const fakeToken = btoa(JSON.stringify({
                userId: userData.id,
                email: userData.email,
                role: 'admin',
                exp: Date.now() + 3600000, // 1h
            }));
            console.log('Dispatching loginSuccess with user:', userData);
            dispatch(loginSuccess({ user: userData, token: fakeToken }));
        } catch (err) {
            console.error('Login error:', err);
            dispatch(loginFailure('Erreur serveur'));
        }
    }

    return (
        <div className={styles.container}>
            <div style={{ display: 'none' }}>{user?.name}</div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1 className={styles.title}>TaskFlow</h1>
                <p className={styles.subtitle}>Connectez-vous pour continuer</p>
                {error && <div className={styles.error}>{error}</div>}
                <input type="email" placeholder="Email"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className={styles.input} required />
                <input type="password" placeholder="Mot de passe"
                    value={password} onChange={e => setPassword(e.target.value)}
                    className={styles.input} required />
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>
        </div>
    );
}