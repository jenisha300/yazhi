const STYLES = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Approved: "bg-green-100 text-green-700 border-green-300",
  Rejected: "bg-red-100 text-red-700 border-red-300",
  Cancelled: "bg-gray-100 text-gray-500 border-gray-300",
  Completed: "bg-blue-100 text-blue-700 border-blue-300",
};

const BookingStatus = ({ status }) => (
  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${STYLES[status] || STYLES.Pending}`}>
    {status}
  </span>
);
export default BookingStatus;
