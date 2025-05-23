import browserAPI from "./browser";
import serverAPI from "./server";

export default import.meta.env.VITE_BUILD_FOR === "server"
    ? serverAPI
    : browserAPI;
