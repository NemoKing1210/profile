import Alpine from "alpinejs";
import { createProfilePage } from "./app/profile-page.js";

/* Cascade: foundation → section components (page order) → motion. */
import "./app.css";
import "./components/topbar/index.js";
import "./components/hero/index.js";
import "./components/about/index.js";
import "./components/stack/index.js";
import "./components/projects/index.js";
import "./components/interests/index.js";
import "./components/links/index.js";
import "./components/comments/index.js";
import "./components/footer/index.js";
import "./components/scroll-top/index.js";
import "./components/infinite-echo/index.js";
import "./components/minecraft-mine/index.js";
import "./shared/styles/motion.css";

Alpine.data("profilePage", createProfilePage);
Alpine.start();
