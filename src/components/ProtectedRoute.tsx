import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../store";

interface Props { children: React.ReactNode; }

export default function ProtectedRoute({ children }: Props) {
    const authState = useSelector((state: RootState) => state.auth);
    const { user } = authState;
    const location = useLocation();

    console.log('ProtectedRoute authState:', authState);
    console.log('ProtectedRoute user:', user);

    if (!user) {
        console.log('No user, redirecting to login');
        return <Navigate to="/login" state={{ from: location.pathname }} replace />
    }
    return <>{children}</>;
}