import { useEffect, useState } from "react";
import { login } from "../services/authService";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";
import Notif from "../components/Notif";
import useNotifStore from "../store/notifStore";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { getCart } from "../services/cartService";
import useCartStore from "../store/cartStore";
import "./Login.scss";

const Login = () => {
    const { t } = useTranslation();
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { setNama, setEmail, setUsername, setToken, setRole } =
        useUserStore();
    const navigate = useNavigate();
    const { teks, show, setNotif, showNotif } = useNotifStore();
    const { setCart } = useCartStore();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(form);
            if (response.status !== 200) {
                setMessage(response.message);
                setNotif(response.message);
                return;
            }
            if (response.data.role == "pelanggan") {
                const fetchCart = await getCart(response.data.token);
                if (fetchCart.status !== 200) {
                    setMessage(fetchCart.message);
                    setNotif(fetchCart.message);
                    return;
                }
                setCart(fetchCart.data);
            }
            setNama(response.data.username);
            setEmail(response.data.email);
            setUsername(response.data.username);
            setToken(response.data.token);
            setRole(response.data.role);
            setMessage(t("login_success"));
            setNotif(t("login_success"));
            if (response.data.role == "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error(err);
            setMessage(t("login_failed"));
            setNotif(t("login_failed"));
        }
    };

    useEffect(() => {
        if (teks) {
            showNotif();
        }
    }, []);

    return (
        <>
            <Notif teks={teks} show={show} />
            <div className="signup-container">
                <div className="form-box">
                    <h2 className="title">{t("login")}</h2>
                    <form onSubmit={handleSubmit} className="form">
                        <input
                            type="email"
                            name="email"
                            placeholder={t("email")}
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <div className="input-password">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder={t("password")}
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <button className="btn kotak" type="submit">
                            {t("login")}
                        </button>
                        <p className="signup-link">
                            your dont have an access?
                            <a href="https://wa.me/6281379430432">
                                contact DEV
                            </a>
                        </p>
                    </form>
                    {message && <p className="error-msg">{message}</p>}
                </div>
            </div>
        </>
    );
};

export default Login;
