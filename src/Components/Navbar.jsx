import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">BlaBla Cars</Link>
        <nav className="flex gap-4">
          <Link to="/" className="hover:underline">Trips</Link>
          <Link to="/bookings" className="hover:underline">My Bookings</Link>
        </nav>
      </div>
    </header>
  );
}
