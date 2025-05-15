import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import CryptoJS from "crypto-js"; // Import crypto-js
import "./AdPlayer.scss";
import { getKeyOne, tokenAdsVerify } from "../services/api";

const AdPlayer = () =>
    // { onAdWatched }
    {
        const navigate = useNavigate();
        const [key, setKey] = useState(null); // State untuk menyimpan key yang didapatkan
        const [loading, setLoading] = useState(true); // State untuk loading

        const encryptionKey = "your-secret-encryption-key";

        useEffect(() => {
            // Cek apakah pengguna sudah terverifikasi di localStorage
            const isVerified = localStorage.getItem("isVerified");
            const storedKey = localStorage.getItem("userKey");
            const expired = localStorage.getItem("expired"); //dalam bentuk timestampt
            localStorage.removeItem("isVerified");

            if (!expired) {
                localStorage.removeItem("userKey");
                return navigate("/");
            }

            function checkExpired() {
                const currentTime = Date.now(); // Mendapatkan waktu saat ini dalam milidetik
                if (currentTime > expired) {
                    localStorage.removeItem("userKey");
                    localStorage.removeItem("expired");
                    return navigate("/"); // Mengarahkan kembali ke halaman verifikasi (HomePage)
                }
            }
            checkExpired();

            if (!storedKey) {
                if (!isVerified) {
                    Swal.fire({
                        icon: "warning",
                        title: "Verifikasi Diperlukan",
                        text: "Anda perlu verifikasi CAPTCHA terlebih dahulu.",
                        confirmButtonText: "OK",
                    }).then(() => {
                        localStorage.removeItem("expired");
                        navigate("/"); // Mengarahkan kembali ke halaman verifikasi (HomePage)
                    });
                } else {
                    (async () => {
                        const fetchVerifyToken = await tokenAdsVerify(
                            isVerified
                        );
                        if (fetchVerifyToken != 200) {
                            return navigate("/");
                        }
                        fetchKey();
                    })();
                }
            } else {
                setKey(decrypt(storedKey));
                setLoading(false);
            }
        }, []);

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
                const response = await getKeyOne();

                if (response.status === 200) {
                    const data = response.data;
                    if (data.key) {
                        setKey(data.key);
                        localStorage.setItem("userKey", encrypt(data.key));
                        Swal.fire({
                            title: "Sukses!",
                            text: "Anda berhasil mendapatkan key!",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                        setLoading(false);
                    }
                } else if (response.status === 404) {
                    Swal.fire({
                        title: "Tidak Ada Key",
                        text: "Tidak ada key yang tersedia.",
                        icon: "warning",
                        confirmButtonText: "OK",
                    }).then(() => {
                        localStorage.removeItem("userKey");
                        localStorage.removeItem("expired");
                        navigate("/");
                    });
                } else {
                    Swal.fire({
                        title: "Error Server",
                        text: "Terjadi kesalahan di server. Coba lagi nanti.",
                        icon: "error",
                        confirmButtonText: "OK",
                    }).then(() => {
                        localStorage.removeItem("userKey");
                        localStorage.removeItem("expired");
                        navigate("/");
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
                <div className="error-message">
                    Tidak ada key yang tersedia.
                </div>
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
