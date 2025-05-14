import React, { useState } from "react";
import Swal from "sweetalert2";
import "./AdminHomePage.scss"; // Jika file SCSS berada di folder yang sama dengan AdminPage.jsx
import { uploadKeys } from "../../services/api"; // Path yang benar untuk impor

const AdminPage = () => {
    const [file, setFile] = useState(null); // State untuk file yang di-upload
    const [durasi, setDurasi] = useState("1 jam"); // Durasi yang dipilih oleh admin
    const [filePreview, setFilePreview] = useState(""); // State untuk menyimpan preview file

    // Fungsi untuk meng-handle file upload
    const handleFileUploadChange = (event) => {
        const selectedFile = event.target.files[0]; // Ambil file yang dipilih

        if (selectedFile && selectedFile.type === "text/plain") {
            setFile(selectedFile); // Simpan file yang dipilih

            // Membaca file untuk preview
            const reader = new FileReader();
            reader.onload = () => {
                setFilePreview(reader.result); // Menampilkan isi file
            };
            reader.readAsText(selectedFile); // Membaca file sebagai teks
        } else {
            Swal.fire("Error", "Mohon pilih file .txt", "error"); // Validasi file yang dipilih
        }
    };

    // Fungsi untuk mengirimkan key ke backend
    const handleSubmit = async (event) => {
        event.preventDefault(); // Mencegah reload halaman

        if (!file) {
            Swal.fire("Error", "Mohon pilih file terlebih dahulu", "error");
            return;
        }

        try {
            // Membaca file dan mengirimkan data ke backend
            const result = await uploadKeys(file, durasi);

            // Menampilkan pesan sukses setelah berhasil mengirim keys
            Swal.fire({
                title: "Peringatan!",
                text: `Berikut adalah key yang diskip: ${result.skippedKeys.join(
                    ", "
                )}`,
                icon: "warning",
                iconColor: "#f39c12",
                showCancelButton: true,
                confirmButtonText: "OK",
                background: "#f9f9f9",
                customClass: {
                    confirmButton: "swal-btn-confirm",
                },
            });

            // Log key yang berhasil ditambahkan
            if (result.addedKeys.length > 0) {
                console.log(
                    `Key yang berhasil ditambahkan: ${result.addedKeys.join(
                        ", "
                    )}`
                );
            }
        } catch (error) {
            // Menangani error
            console.error("Error:", error);
            Swal.fire("Gagal", "Terjadi kesalahan saat mengirim data", "error");
        }
    };

    return (
        <>
            <div className="file-preview">
                {filePreview && (
                    <div className="file-preview">
                        <h3>Preview File:</h3>
                        <pre>{filePreview}</pre>
                    </div>
                )}
            </div>

            <div className="admin-container">
                <h2>Tambah Key (Admin)</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        accept=".txt"
                        onChange={handleFileUploadChange}
                        required
                    />
                    <select
                        value={durasi}
                        onChange={(e) => setDurasi(e.target.value)}
                    >
                        <option value="1 jam">1 jam</option>
                        <option value="1 minggu">1 minggu</option>
                        <option value="1 bulan">1 bulan</option>
                    </select>
                    <button type="submit">Tambah Key</button>
                </form>
            </div>
        </>
    );
};

export default AdminPage;
