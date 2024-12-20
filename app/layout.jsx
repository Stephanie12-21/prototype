import { Poppins } from "next/font/google";
import "./globals.css";
import Provider from "./context/Provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Lilee",
  description: "Live like everyone else",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider>
        <body className={poppins.variable}>{children}</body>
      </Provider>
    </html>
  );
}
