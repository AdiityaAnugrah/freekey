import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import CryptoJS from "crypto-js"; // Import crypto-js
import "./AdPlayer.scss";

const AdPlayer = ({ onAdWatched }) => {
    const navigate = useNavigate();
    const [key, setKey] = useState(null); // State untuk menyimpan key yang didapatkan
    const [loading, setLoading] = useState(true); // State untuk loading

    const encryptionKey = "your-secret-encryption-key";

    useEffect(() => {
        // Cek apakah pengguna sudah terverifikasi di localStorage
        const isVerified = localStorage.getItem("isVerified");

        if (!isVerified) {
            Swal.fire({
                icon: "warning",
                title: "Verifikasi Diperlukan",
                text: "Anda perlu verifikasi CAPTCHA terlebih dahulu.",
                confirmButtonText: "OK",
            }).then(() => {
                navigate("/"); // Mengarahkan kembali ke halaman verifikasi (HomePage)
            });
        } else {
            // Jika sudah terverifikasi, cek apakah sudah ada key di localStorage
            const storedKey = localStorage.getItem("userKey");

            if (storedKey) {
                // Dekripsi key sebelum digunakan
                const decryptedKey = decrypt(storedKey);
                setKey(decryptedKey); // Gunakan key yang sudah disimpan dan didekripsi
                setLoading(false);
            } else {
                // Jika belum ada key di localStorage, ambil key baru
                fetchKey();
            }
        }
    }, [navigate]);

    // Fungsi untuk mengenkripsi data menggunakan crypto-js
    const encrypt = (text) => {
        return CryptoJS.AES.encrypt(text, encryptionKey).toString();
    };

    // Fungsi untuk mendekripsi data
    const decrypt = (cipherText) => {
        const bytes = CryptoJS.AES.decrypt(cipherText, encryptionKey);
        return bytes.toString(CryptoJS.enc.Utf8); // Mengembalikan hasil dekripsi dalam bentuk string
    };

    // Fungsi untuk mendapatkan key dari backend
    const fetchKey = async () => {
        try {
            const apiUrl = import.meta.env.VITE_URL_BACKEND;

            const response = await fetch(`${apiUrl}/key/create-key`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setLoading(false); // Selesai loading setelah menerima respons

            if (response.status === 200) {
                const data = await response.json();
                if (data.key) {
                    setKey(data.key); // Simpan key yang didapatkan
                    // Simpan key yang telah dienkripsi di localStorage
                    const encryptedKey = encrypt(data.key);
                    localStorage.setItem("userKey", encryptedKey);
                    Swal.fire({
                        title: "Sukses!",
                        text: "Anda berhasil mendapatkan key!",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    onAdWatched({ key: data.key }); // Panggil callback untuk memberikan key
                }
            } else if (response.status === 404) {
                Swal.fire({
                    title: "Tidak Ada Key",
                    text: "Tidak ada key yang tersedia.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
            } else if (response.status === 500) {
                Swal.fire({
                    title: "Error Server",
                    text: "Terjadi kesalahan di server. Coba lagi nanti.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            setLoading(false); // Selesai loading meskipun terjadi error
            Swal.fire({
                title: "Error",
                text: "Gagal mendapatkan key.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    if (loading) {
        return <div className="loading-message">Loading Key...</div>; // Tampilkan loading jika masih menunggu
    }

    if (!key) {
        return (
            <div className="error-message">Tidak ada key yang tersedia.</div>
        ); // Tampilkan error jika tidak ada key
    }

    return (
        <div className="adplayer-container">
            <div className="adplayer-card">
                <h2>Selamat! Anda berhasil mendapatkan key.</h2>
                <div className="my-4">
                    <strong>Your Key: </strong>
                    <span>{key}</span>
                </div>
                <button
                    className="adplayer-btn"
                    onClick={() => navigate("/success")}
                >
                    Lanjutkan
                </button>
            </div>
        </div>
    );
};

export default AdPlayer;
