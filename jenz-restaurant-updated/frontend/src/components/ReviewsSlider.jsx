import { useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    name: "Karthik Subramaniam",
    initials: "KS",
    food: "masala dosa",
    rating: 5,
    text: "The crispy masala dosa reminded me of my grandmother's cooking in Madurai. Genuinely one of the best South Indian meals I've had outside my hometown.",
  },
  {
    name: "Lakshmi Narayanan",
    initials: "LN",
    food: "sambar & idli",
    rating: 5,
    text: "The idli was so soft and the sambar had that perfect tangy warmth. The ambience made our anniversary dinner feel truly special.",
  },
  {
    name: "Priya Venkatesan",
    initials: "PV",
    food: "Chettinad chicken",
    rating: 4,
    text: "Authentic Chettinad flavours cooked just right — spicy, aromatic, and full of depth. Service was warm and attentive throughout.",
  },
  {
    name: "Arun Kumaresan",
    initials: "AK",
    food: "Kothu Parotta",
    rating: 5,
    text: "Booked the birthday package for my daughter and the team went above and beyond — the decoration, the cake, everything felt personal.",
  },
  {
    name: "Divya Ramachandran",
    initials: "DR",
    food: "filter coffee",
    rating: 5,
    text: "Ended the meal with their filter coffee and it was the perfect finish. Elegant space, thoughtful staff, and food that tastes homemade.",
  },
  {
    name: "Senthil Raja",
    initials: "SR",
    food: "mutton biryani",
    rating: 4,
    text: "Brought the whole family for a weekend celebration — generous portions, great flavour balance, and the kids loved the desserts.",
  },
  {
    name: "Anitha Krishnamurthy",
    initials: "AK",
    food: "paal payasam",
    rating: 5,
    text: "The paal payasam was outstanding, and our server remembered it was our anniversary without us mentioning it twice. Lovely touch.",
  },
  {
    name: "Vignesh Elangovan",
    initials: "VE",
    food: "Kongunadu specials",
    rating: 5,
    text: "A quiet corner table, candlelight, and food that didn't miss a beat — perfect spot for a low-key date night.",
  },
  {
    name: "Meera Chandrasekar",
    initials: "MC",
    food: "vegetable kurma",
    rating: 4,
    text: "Loved that they had a proper vegetarian tasting menu. Every dish felt carefully thought through, not an afterthought.",
  },
];

const ReviewsSlider = () => {
  const trackRef = useRef(null);

  const scrollByCard = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("[data-review-card]");
    const gap = 24;
    const amount = card ? card.offsetWidth + gap : 320;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4 no-scrollbar"
      >
        {reviews.map((r) => (
          <div
            key={r.name}
            data-review-card
            className="snap-start shrink-0 w-[82%] xs:w-[70%] sm:w-[340px]"
          >
            <ReviewCard {...r} />
          </div>
        ))}
      </div>

      {/* Desktop side arrows */}
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Previous reviews"
        className="hidden md:flex absolute top-1/2 -left-5 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-premium items-center justify-center text-charcoal hover:bg-gold hover:text-charcoal transition"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Next reviews"
        className="hidden md:flex absolute top-1/2 -right-5 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-premium items-center justify-center text-charcoal hover:bg-gold hover:text-charcoal transition"
      >
        <ChevronRight size={20} />
      </button>

      {/* Mobile compact arrows */}
      <div className="flex md:hidden justify-center gap-3 mt-5">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Previous reviews"
          className="w-10 h-10 rounded-full bg-white shadow-premium flex items-center justify-center text-charcoal active:bg-gold transition"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Next reviews"
          className="w-10 h-10 rounded-full bg-white shadow-premium flex items-center justify-center text-charcoal active:bg-gold transition"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const ReviewCard = ({ name, initials, food, rating, text }) => (
  <div className="card-premium p-7 h-full flex flex-col">
    <Quote className="text-gold/40 mb-3" size={28} />
    <p className="text-charcoal/70 text-sm leading-relaxed mb-6 flex-1">{text}</p>
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-full bg-gold-gradient text-charcoal font-display font-bold flex items-center justify-center text-sm shrink-0">
        {initials}
      </div>
      <div>
        <p className="font-semibold text-sm">{name}</p>
        <p className="text-xs text-charcoal/50">Loved the {food}</p>
      </div>
      <div className="ml-auto flex gap-0.5">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={13} className="fill-gold text-gold" />
        ))}
      </div>
    </div>
  </div>
);

export default ReviewsSlider;
