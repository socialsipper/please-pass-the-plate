import "./globals.css";
import NavBar from "./NavBar";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata = {
  title: "Please, Pass the Plate",
  description: "A private family recipe hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.className} bg-white`}>
        <div className="p-4">
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  );
}