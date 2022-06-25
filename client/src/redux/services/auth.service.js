
const logout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("roleUser");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("fullName");
    sessionStorage.removeItem('linkPage');
    window.location.replace('/auth/login'); 
};

export default {
  logout,
};