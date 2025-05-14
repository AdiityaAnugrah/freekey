import React, { useState, useEffect } from "react";

const AdPage = ({ onAdWatched }) => {
    const [adFinished, setAdFinished] = useState(false); // Menyimpan status apakah iklan selesai
    const [timer, setTimer] = useState(0); // Timer untuk menghitung durasi iklan

    useEffect(() => {
        // Menyimulasikan iklan dengan durasi 5 detik (misalnya)
        const adDuration = 5; // Durasi iklan dalam detik
        let count = 0;
        const interval = setInterval(() => {
            count++;
            setTimer(count);
            if (count >= adDuration) {
                clearInterval(interval);
                setAdFinished(true); // Setelah durasi iklan selesai
            }
        }, 1000);

        return () => clearInterval(interval); // Membersihkan interval ketika komponen di-unmount
    }, []);

    const handleGetKey = () => {
        onAdWatched("GeneratedKey123"); // Memberikan key ke parent komponen
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-semibold mb-4">Menonton Iklan</h2>
                <div className="mb-4">
                    <p>{`Iklan sedang diputar... ${timer} detik`}</p>
                    {adFinished && (
                        <div>
                            <button
                                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4"
                                onClick={handleGetKey}
                            >
                                Lanjutkan untuk Mendapatkan Key
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdPage;
