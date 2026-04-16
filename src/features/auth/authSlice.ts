import { createSlice, type PayloadAction } from '@reduxjs/toolkit'; 
  
interface User { id: string; email: string; name: string; } 
  
interface AuthState { 
  user: User | null; 
  token: string | null; 
  loading: boolean; 
  error: string | null; 
} 
  
const loadState = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      return { user: JSON.parse(user), token, loading: false, error: null };
    }
  } catch (e) {
    // ignore
  }
  return { user: null, token: null, loading: false, error: null };
};
  
const initialState: AuthState = loadState(); 
  
const authSlice = createSlice({ 
  name: 'auth', 
  initialState, 
  reducers: { 
    loginStart(state) { 
      console.log('loginStart reducer');
      state.loading = true; 
      state.error = null; 
    }, 
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) { 
      console.log('loginSuccess reducer called with:', action.payload);
      console.log('action.payload.user:', action.payload.user);
      state.user = action.payload.user; 
      state.token = action.payload.token; 
      state.loading = false; 
      console.log('state after loginSuccess:', state);
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    }, 
    loginFailure(state, action: PayloadAction<string>) { 
      console.log('loginFailure reducer');
      state.loading = false; 
      state.error = action.payload; 
    }, 
    logout(state) { 
      console.log('logout reducer');
      state.user = null; 
      state.token = null; 
      state.loading = false; 
      state.error = null; 
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }, 
  }, 
}); 
  
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions; 
export default authSlice.reducer; 
