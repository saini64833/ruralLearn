export default function Offline() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold mb-2">You are offline</h1>
      <p className="text-gray-600">
        Please check your internet connection.
      </p>
    </div>
  );
}
