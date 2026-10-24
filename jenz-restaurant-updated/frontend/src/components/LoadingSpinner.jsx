const LoadingSpinner = ({ label = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4 text-charcoal/60">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-gold/20 rounded-full" />
      <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
    <p className="text-sm tracking-wide">{label}</p>
  </div>
);
export default LoadingSpinner;
