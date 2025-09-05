// import { createSlice } from "@reduxjs/toolkit";
// import Cookies from "js-cookie";

// const initialState = {
//   accessToken:
//     typeof window !== "undefined" ? Cookies.get("accessToken") : null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setCredentials: (state, action) => {
//       const data = action.payload.data || action.payload;

//       const accessToken = data?.accessToken || data?.token;
//       const refreshToken = data?.refreshToken || data?.refresh_token;
//       const sessionId = data?.sessionId || data?.session_id;
//       const user = data?.user || null;

//       state.accessToken = accessToken || null;
//       state.refreshToken = refreshToken || null;
//       state.sessionId = sessionId || null;
//       state.user = user;

//       if (typeof window !== "undefined") {
//         if (accessToken) {
//           Cookies.set("accessToken", accessToken, { expires: 30 });
//           localStorage.setItem("accessToken", accessToken);
//         } else {
//           localStorage.removeItem("accessToken");
//         }
//       }
//     },

//     logOut: (state) => {
//       state.accessToken = null;
//       state.refreshToken = null;
//       state.sessionId = null;
//       state.user = null;

//       if (typeof window !== "undefined") {
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("user");
        
//       }
//     },
//   },
// });

// export const { setCredentials, logOut } = authSlice.actions;
// export default authSlice.reducer;

// export const selectCurrentToken = (state) => state.auth.accessToken;







import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  role?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  sessionId: string | null;
  user: User | null;
}

const initialState: AuthState = {
  accessToken: typeof window !== "undefined" ? Cookies.get("accessToken") || null : null,
  refreshToken: null,
  sessionId: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{
      data?: {
        accessToken?: string;
        token?: string;
        refreshToken?: string;
        refresh_token?: string;
        sessionId?: string;
        session_id?: string;
        user?: User;
      };
      accessToken?: string;
      token?: string;
      refreshToken?: string;
      refresh_token?: string;
      sessionId?: string;
      session_id?: string;
      user?: User;
    }>) => {
      const data = action.payload.data || action.payload;
      const accessToken = data?.accessToken || data?.token;
      const refreshToken = data?.refreshToken || data?.refresh_token;
      const sessionId = data?.sessionId || data?.session_id;
      const user = data?.user || null;

      state.accessToken = accessToken || null;
      state.refreshToken = refreshToken || null;
      state.sessionId = sessionId || null;
      state.user = user;

      if (typeof window !== "undefined") {
        if (accessToken) {
          Cookies.set("accessToken", accessToken, { 
            expires: 30,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
          });
          localStorage.setItem("accessToken", accessToken);
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
          }
        }
      }
    },
    logOut: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.sessionId = null;
      state.user = null;

      if (typeof window !== "undefined") {
        Cookies.remove("accessToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      }
    },
  },
});

// Export actions
export const { setCredentials, logOut, updateUser } = authSlice.actions;

// Export selectors
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentUserId = (state: { auth: AuthState }) => state.auth.user?.id;
export const selectCurrentSession = (state: { auth: AuthState }) => ({
  sessionId: state.auth.sessionId,
  refreshToken: state.auth.refreshToken
});

// Export the reducer
export default authSlice.reducer;