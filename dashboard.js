const { createApp, ref, onMounted, computed } = Vue;

createApp({
    setup() {
        const currentMenu = ref('home');
        const activeRoleTab = ref('admin');
        const isSidebarCollapsed = ref(false);
        const activeDropdown = ref(null);

        const userRole = ref('');
        const userToken = ref(''); // Dipertahankan untuk tampilan di UI jika perlu
        const usersData = ref([]);

        const showEditModal = ref(false);
        const editFormData = ref({ id: null, username: '', role_id: 1 });

        const showAddModal = ref(false);
        const addFormData = ref({ username: '', password: '', role_id: 1 });

        // --- FUNGSI API (sekarang menggunakan apiService.js) ---

        const fetchUsers = async () => {
            try {
                // apiService akan otomatis menangani error token & logout
                const data = await api.getUsers();
                usersData.value = data;
            } catch (error) {
                console.error("Gagal mengambil data pengguna:", error);
                // Di sini Anda bisa menambahkan notifikasi toast error
            }
        };

        const submitAdd = async () => {
            if (!addFormData.value.username || !addFormData.value.password) {
                alert("Username dan Password harus diisi!");
                return;
            }
            try {
                // Menggunakan endpoint baru yang aman dan khusus admin
                await api.createUser({
                    username: addFormData.value.username,
                    password: addFormData.value.password,
                    role_id: addFormData.value.role_id
                });
                showAddModal.value = false;
                fetchUsers(); // Muat ulang data setelah berhasil
            } catch (error) {
                console.error("Error adding user:", error);
                alert(error.message); // Tampilkan pesan error dari backend
            }
        };
        
        const submitEdit = async () => {
            try {
                await api.updateUser(editFormData.value.id, {
                    username: editFormData.value.username,
                    role_id: editFormData.value.role_id
                });
                showEditModal.value = false;
                fetchUsers();
            } catch (error) {
                console.error("Error updating user:", error);
                alert(error.message);
            }
        };

        const deleteUser = async (id) => {
            if (!confirm('Peringatan: Apakah Anda yakin ingin menghapus akun ini secara permanen?')) {
                activeDropdown.value = null;
                return;
            }
            try {
                await api.deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
                alert(error.message);
            } finally {
                activeDropdown.value = null;
            }
        };

        // --- FUNGSI UI & State Management ---

        const adminList = computed(() => usersData.value.filter(u => u.role === 'admin'));
        const userList = computed(() => usersData.value.filter(u => u.role === 'user'));

        onMounted(() => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');

            if (!token) {
                window.location.href = 'index.html';
                return;
            } else {
                userToken.value = token;
                userRole.value = role;
            }

            fetchUsers();

            if (window.innerWidth <= 768) {
                isSidebarCollapsed.value = true;
            }

            document.addEventListener('click', () => {
                activeDropdown.value = null;
                if (window.innerWidth <= 768 && !showEditModal.value && !showAddModal.value) {
                    isSidebarCollapsed.value = true;
                }
            });
        });

        const toggleSidebar = () => {
            isSidebarCollapsed.value = !isSidebarCollapsed.value;
        };

        const selectMenu = (menu) => {
            currentMenu.value = menu;
            if (window.innerWidth <= 768) {
                isSidebarCollapsed.value = true;
            }
        };

        const toggleDropdown = (id) => {
            activeDropdown.value = activeDropdown.value === id ? null : id;
        };

        const openAddModal = (roleId) => {
            addFormData.value = { username: '', password: '', role_id: roleId };
            showAddModal.value = true;
        };

        const closeAddModal = () => {
            showAddModal.value = false;
        };

        const editUser = (user) => {
            editFormData.value = {
                id: user.id,
                username: user.username,
                role_id: user.role === 'admin' ? 1 : 2
            };
            showEditModal.value = true;
            activeDropdown.value = null;
        };

        const closeEditModal = () => {
            showEditModal.value = false;
        };

        const handleLogout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = 'index.html';
        };

        return {
            currentMenu, activeRoleTab, isSidebarCollapsed, activeDropdown,
            userRole, userToken, adminList, userList,
            showEditModal, editFormData, showAddModal, addFormData,
            toggleSidebar, selectMenu, toggleDropdown,
            openAddModal, closeAddModal, submitAdd,
            editUser, closeEditModal, submitEdit, deleteUser, handleLogout
        };
    }
}).mount('#app');
