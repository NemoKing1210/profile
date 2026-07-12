import Alpine from "alpinejs";
import { createProfilePage } from "./alpine/profile-page.js";
import "./styles/index.css";

Alpine.data("profilePage", createProfilePage);
Alpine.start();
