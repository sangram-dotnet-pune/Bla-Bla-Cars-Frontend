import { Link } from "react-router-dom";

export default function TripCard({ trip }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">
            {trip.startLocation} → {trip.endLocation}
          </h3>

          <p className="text-sm text-gray-600">
            Departure: {new Date(trip.departureTime).toLocaleString()}
          </p>

          <p className="text-sm text-gray-600">
            Seats available: <span className="font-medium">{trip.availableSeats}</span>
          </p>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold">₹{trip.pricePerSeat}</div>

          <Link
            to={`/booking/${trip.tripId}`}
            className="mt-2 inline-block bg-blue-600 text-white px-3 py-1 rounded"
          >
            Book
          </Link>
        </div>
      </div>
    </div>
  );
}
