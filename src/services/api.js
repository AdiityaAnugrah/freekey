const API_URL = `${import.meta.env.VITE_URL_BACKEND}`;

// Fungsi untuk mendapatkan semua key
const getAllKeys = async () => {
    try {
        const response = await fetch(`${API_URL}/key`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(
                `Error: ${response.status} - ${response.statusText}`
            );
        }
    } catch (error) {
        console.error("Error fetching all keys:", error);
        throw error;
    }
};

const getKeyById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/key/${id}`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(
                `Error: ${response.status} - ${response.statusText}`
            );
        }
    } catch (error) {
        console.error(`Error fetching key by ID ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk membuat key baru
const createKey = async (keys, durasi) => {
    try {
        const response = await fetch(`${API_URL}/key`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ keys, durasi }),
        });
        if (response.status === 200) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(
                `Error: ${response.status} - ${response.statusText}`
            );
        }
    } catch (error) {
        console.error("Error creating key:", error);
        throw error;
    }
};

// Fungsi untuk menghapus key berdasarkan ID
const deleteKey = async (keyId) => {
    try {
        const response = await fetch(`${API_URL}/key/${keyId}`, {
            method: "DELETE",
        });
        if (response.status === 200) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(
                `Error: ${response.status} - ${response.statusText}`
            );
        }
    } catch (error) {
        console.error(`Error deleting key with ID ${keyId}:`, error);
        throw error;
    }
};

const verifyCaptcha = async (token) => {
    try {
        // Mengirim permintaan POST ke backend untuk memverifikasi token
        const response = await fetch(`${API_URL}/key/verifikasi-captcha`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }), // Mengirimkan token yang diterima dari Turnstile
        });

        // Mengecek status response dan menangani hasilnya
        if (response.status === 200) {
            const data = await response.json(); // Mengambil data JSON dari response
            return data; // Mengembalikan hasil response jika verifikasi berhasil
        } else if (response.status === 400) {
            // Jika status 400, berarti verifikasi gagal
            throw new Error("Verifikasi gagal, token tidak valid.");
        } else {
            // Menangani error lainnya berdasarkan status code
            throw new Error(
                `Error: ${response.status} - ${response.statusText}`
            );
        }
    } catch (error) {
        // Menangani error dan mencetaknya ke konsol
        console.error("Error verifying captcha:", error);
        throw error; // Melemparkan error ke atas untuk ditangani di tempat lain
    }
};

const uploadKeys = async (file, durasi) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = async () => {
            const fileContent = reader.result;
            const keys = fileContent
                .split("\n") // Pisahkan berdasarkan baris
                .map((key) => key.trim()) // Menghilangkan spasi di awal/akhir
                .filter((key) => key.length > 0); // Menghilangkan baris kosong

            try {
                // Kirimkan keys dan durasi ke backend
                const response = await fetch(`${API_URL}/key`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ keys, durasi }), // Mengirim keys dan durasi ke backend
                });

                if (response.status === 200) {
                    const data = await response.json();
                    resolve({
                        message: data.message,
                        addedKeys: data.addedKeys, // Mendapatkan key yang berhasil ditambahkan
                        skippedKeys: data.skippedKeys, // Mendapatkan key yang di-skip
                    });
                } else {
                    throw new Error(
                        `Error: ${response.status} - ${response.statusText}`
                    );
                }
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsText(file); // Membaca file teks
    });
};

export {
    getAllKeys,
    createKey,
    deleteKey,
    getKeyById,
    verifyCaptcha,
    uploadKeys,
};
