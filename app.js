const { createApp, ref } = Vue;

createApp({
    setup() {
        const username = ref('');
        const password = ref('');
        const errorMessage = ref('');
        const isLoading = ref(false);

        const handleLogin = async () => {
            isLoading.value = true;
            errorMessage.value = '';

            try {
                // Memanggil fungsi login dari apiService
                const data = await api.login(username.value, password.value);

                // Jika sukses, simpan token dan role
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                
                // Arahkan ke halaman dashboard
                window.location.href = 'dashboard.html';
                
            } catch (error) {
                // apiService sudah melempar error dengan pesan yang benar
                errorMessage.value = error.message;
                console.error(error);
            } finally {
                isLoading.value = false;
            }
        };

        return {
            username,
            password,
            errorMessage,
            isLoading,
            handleLogin
        };
    }
}).mount('#app');
