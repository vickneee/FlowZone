export const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user') ?? 'null');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`,
    };
};
