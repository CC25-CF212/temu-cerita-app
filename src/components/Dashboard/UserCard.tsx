export default function UserCard({ count }: { count: number }) {
  return (
    <div className="bg-white rounded-md shadow-sm p-4 mb-6">
      <div className="flex items-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span className="text-gray-700 font-medium">Total Users</span>
      </div>
      <div className="text-4xl font-bold text-gray-900">{count}</div>
    </div>
  );
}