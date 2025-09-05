import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadAuthState } from "../../Utils/authPersistence";
import { setCredentials } from "../../Features/authSlice";

const InitialAuthCheck = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    const { user, accessToken, refreshToken } = loadAuthState();

    if (accessToken && user) {
      dispatch(setCredentials({ user, accessToken, refreshToken }));

      // Redirect to verify-email if email is not verified
      if (
        !user.isEmailVerified &&
        window.location.pathname !== "/verify-email"
      ) {
        navigate("/verify-email");
      }
    } else if (
      !user &&
      !["/login", "/signup", "/forgot-password"].includes(
        window.location.pathname
      )
    ) {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  return null;
};

export default InitialAuthCheck;
