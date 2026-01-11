export default function Offline() {
  return (
    <div className="flex items-center justify-center h-screen text-center">
      <div>
        <h1 className="text-3xl font-bold mb-4">You are offline</h1>
        <p className="text-lg">
          Some features may not be available. Please check your internet
          connection.
        </p>
      </div>
    </div>
  );
}
