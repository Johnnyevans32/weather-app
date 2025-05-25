import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/HomePage.tsx"),
  route("chat", "pages/ChatPage.tsx"),
  route("/weather/:city", "pages/WeatherDetailPage.tsx"),
] satisfies RouteConfig;
