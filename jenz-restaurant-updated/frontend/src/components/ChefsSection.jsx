import { ChefHat, Star, Award } from "lucide-react";

const chefs = [
  {
    name: "Chef Arjun Subramanian",
    initials: "AS",
    position: "Executive Chef",
    specialty: "Tamil Nadu Traditional Cuisine",
    experience: "18+ Years Experience",
    rating: "4.9",
    dish: "Chettinad Chicken",
    desc: "Trained in traditional Tamil kitchens, Arjun leads the menu with recipes passed down through three generations of his family.",
  },
  {
    name: "Chef Meenakshi Krishnan",
    initials: "MK",
    position: "Head Chef — South Indian Cuisine",
    specialty: "Vegetarian Tamil Cuisine",
    experience: "15+ Years Experience",
    rating: "4.8",
    dish: "Kothu Parotta & Vegetable Kurma",
    desc: "Meenakshi specializes in vegetarian Tamil fare, balancing bold spice with comfort in every plate she sends out.",
  },
  {
    name: "Chef Karthik Rajendran",
    initials: "KR",
    position: "Specialty Chef — Chettinad Cuisine",
    specialty: "Chettinad & Kongunadu Cuisine",
    experience: "16+ Years Experience",
    rating: "4.9",
    dish: "Chettinad Mutton",
    desc: "Karthik's mastery of Chettinad spice blends brings depth and heat to Yāzhi's most-loved non-vegetarian dishes.",
  },
  {
    name: "Chef Priya Balasubramaniam",
    initials: "PB",
    position: "Pastry & South Indian Desserts Chef",
    specialty: "Traditional South Indian Desserts",
    experience: "12+ Years Experience",
    rating: "4.8",
    dish: "Paal Payasam",
    desc: "Priya turns classic South Indian sweets into refined desserts, closing every celebration meal on a memorable note.",
  },
];

const ChefsSection = () => (
  <div>
    <p className="text-center text-[11px] uppercase tracking-widest text-charcoal/35 -mt-8 mb-10">
      
    </p>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {chefs.map((chef) => (
        <ChefCard key={chef.name} {...chef} />
      ))}
    </div>
  </div>
);

const ChefCard = ({ name, initials, position, specialty, experience, rating, dish, desc }) => (
  <div className="group card-premium overflow-hidden hover:-translate-y-2 hover:shadow-lg transition-all duration-400">
    <div className="relative h-44 bg-charcoal-gradient flex items-center justify-center overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gold/10 blur-2xl transition-transform duration-500 group-hover:scale-125" />
      <div className="w-20 h-20 rounded-full bg-gold-gradient text-charcoal font-display font-bold text-2xl flex items-center justify-center shadow-gold ring-4 ring-charcoal2/40 transition-transform duration-500 group-hover:scale-110">
        {initials}
      </div>
      <span className="absolute top-3 right-3 text-gold/70">
        <ChefHat size={20} />
      </span>
      {/* Hover / tap reveal */}
      <div className="absolute inset-0 bg-charcoal/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center p-4">
        <p className="text-cream/85 text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-display text-lg leading-tight mb-0.5">{name}</h3>
      <p className="text-goldDark text-xs font-semibold mb-2">{position}</p>
      <p className="text-charcoal/55 text-xs mb-3">{specialty}</p>
      <div className="flex items-center justify-between text-xs text-charcoal/60 mb-3">
        <span>{experience}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-charcoal">
          <Star size={13} className="fill-gold text-gold" /> {rating}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-charcoal/70 border-t border-charcoal/10 pt-3">
        <Award size={14} className="text-gold shrink-0" />
        <span>
          Signature: <span className="font-semibold">{dish}</span>
        </span>
      </div>
    </div>
  </div>
);

export default ChefsSection;
