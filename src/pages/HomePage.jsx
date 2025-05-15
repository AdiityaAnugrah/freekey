import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Turnstile from "react-turnstile"; // Import Turnstile
import "./HomePage.scss";
import { tokenAdsCreate } from "../services/api";

const HomePage = () => {
    const [isVerified, setIsVerified] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [showVerification, setShowVerification] = useState(true);
    const [showPopup, setShowPopup] = useState(false); // For showing popup
    const [loading, setLoading] = useState(true); // Show loading while waiting for response
    const [isLoading, setIsLoading] = useState(false); // For showing "Please wait..." during the delay
    const navigate = useNavigate();
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

    const goToAdPlayer = async () => {
        console.log(isVerified);
        const hasilFetchToken = await tokenAdsCreate();
        console.log(hasilFetchToken);
        localStorage.setItem("isVerified", hasilFetchToken.data.token);
        const expired = Date.now() + 2 * 60 * 1000;
        localStorage.setItem("expired", expired);
        navigate("/adplayer");
    };
    const openAffiliateTabs = () => {
        const affiliateLinks = [
            "https://s.shopee.co.id/4q36JRFwsj",
            "https://s.shopee.co.id/6poAhCt7mW",
            "https://s.shopee.co.id/707atUNgR8",
            "https://www.profitableratecpm.com/um8zi4qf?key=ae4f83193cbfb411edc4cc1c08f1c48d",
        ];

        if (clickCount < 3) {
            setIsLoading(true);
            setTimeout(() => {
                window.open(affiliateLinks[clickCount], "_blank");
                setClickCount((prevCount) => prevCount + 1);
                setIsLoading(false);
            }, 3000);
        }

        if (clickCount === 3) {
            setIsLoading(true); // Start loading after 3 clicks
            setTimeout(() => {
                Swal.fire({
                    title: "Apakah Anda berusia 18+ tahun atau lebih?",
                    showCancelButton: true,
                    confirmButtonText: "Ya",
                    cancelButtonText: "Tidak",
                }).then((result) => {
                    if (result.isConfirmed) {
                        goToAdPlayer();
                    } else {
                        Swal.fire({
                            title: "Akses Ditolak",
                            text: "Anda harus berusia 18 tahun atau lebih untuk melanjutkan.",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    }
                });
                setIsLoading(false); // Reset loading state after the delay
            }, 3000); // Wait 3 seconds before showing the age check popup
        }
    };

    // Show popup after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopup(true); // Show popup after 5 seconds
        }, 5000);

        return () => clearTimeout(timer); // Cleanup the timeout when component is unmounted
    }, []);

    // Close popup function
    const closePopup = () => {
        setShowPopup(false);
    };

    useEffect(() => {
        if (!siteKey) {
            console.error("Site Key is missing!");
        }
        setLoading(false);
    }, [siteKey]);

    return (
        <div className="container mx-auto p-6 space-y-6">
            {loading && <div className="loading-message">Loading...</div>}

            <div className="top-banner">
                <div className="banner-content"></div>
            </div>

            <h1 className="text-3xl font-semibold text-center mb-6">
                Dapatkan Key Gratis dari Kami!
            </h1>
            <div className="text-center text-lg text-gray-700 mb-6">
                <p>
                    Untuk mendapatkan key gratis, ikuti langkah-langkah berikut:
                </p>
                <ol className="list-decimal pl-5">
                    <li>Verifikasi bahwa Anda adalah manusia</li>
                    <li>Tunggu hingga tombol "Dapatkan Key" muncul</li>
                    <li>Klik tombol untuk mendapatkan key Anda</li>
                </ol>
            </div>

            {/* Turnstile Verification */}
            {showVerification && (
                <div className="flex justify-center mb-6">
                    <Turnstile
                        sitekey={siteKey}
                        onVerify={async (token) => {
                            try {
                                const response = await fetch(
                                    `${
                                        import.meta.env.VITE_URL_BACKEND
                                    }/key/verifikasi-captcha`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ token }),
                                    }
                                );
                                // const responseJson = await response.json();
                                if (response.status == 200) {
                                    setIsVerified(true);
                                    setShowButton(true);
                                    setShowVerification(false);
                                    // localStorage.setItem("isVerified", "true");
                                } else {
                                    Swal.fire({
                                        icon: "error",
                                        title: "Verifikasi Gagal",
                                        text: "Coba lagi.",
                                    });
                                    setShowButton(false);
                                }
                            } catch (error) {
                                console.error(
                                    "Verifikasi CAPTCHA gagal:",
                                    error
                                );
                                Swal.fire({
                                    icon: "error",
                                    title: "Terjadi Kesalahan",
                                    text: "Silakan coba lagi.",
                                });
                            }
                        }}
                    />
                </div>
            )}

            {/* Middle Banner */}
            <div className="middle-banner">
                <div className="banner-content">Iklan Banner Tengah</div>
            </div>

            {/* Show Button after verification */}
            {showButton && (
                <div className="text-center">
                    <button
                        className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-600"
                        onClick={openAffiliateTabs}
                        disabled={isLoading} // Disable the button while loading
                    >
                        {isLoading ? "Please wait..." : "Dapatkan Key"}
                    </button>
                    <p className="mt-2 text-sm text-gray-500">
                        {clickCount}/3 klik untuk mendapatkan key.
                    </p>
                </div>
            )}

            {/* Bottom Banner */}
            <div className="bottom-banner">
                <div className="banner-content">Iklan Banner Bawah</div>
            </div>

            {/* Popup Iklan Video */}
            {showPopup && (
                <div className={`popup-overlay ${showPopup ? "show" : ""}`}>
                    <div className="popup-container open">
                        <button
                            className="close-btn"
                            style={{ zIndex: "1000" }}
                            onClick={closePopup}
                        >
                            X
                        </button>
                        <div className="video-container">
                            {/* <iframe
                                width="560"
                                height="315"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                title="Iklan Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe> */}
                        </div>
                        <div className="close-message" onClick={closePopup}>
                            Tap di mana saja untuk menutup video
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
