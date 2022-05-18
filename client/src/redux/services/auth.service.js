
const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("roleUser");
    localStorage.removeItem("user");
    localStorage.removeItem("fullName");
    window.location.replace('/auth/login'); 
};

export default {
  logout,
};