import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Cake, Heart, Users, Wine, PartyPopper, Sparkles,
  Utensils, Gift, Clock, ArrowRight,
} from "lucide-react";
import InteractiveImage from "./InteractiveImage";

import birthday1 from "../assets/images/moments/birthday/birthday-1.jpg";
import birthday2 from "../assets/images/moments/birthday/birthday-2.jpg";
import birthday3 from "../assets/images/moments/birthday/birthday-3.jpg";
import anniversary1 from "../assets/images/moments/anniversary/anniversary-1.jpg";
import anniversary2 from "../assets/images/moments/anniversary/anniversary-2.jpg";
import anniversary3 from "../assets/images/moments/anniversary/anniversary-3.jpg";
import family1 from "../assets/images/moments/family/family-1.jpg";
import family2 from "../assets/images/moments/family/family-2.jpg";
import family3 from "../assets/images/moments/family/family-3.jpg";
import romantic1 from "../assets/images/moments/romantic/romantic-1.jpg";
import romantic2 from "../assets/images/moments/romantic/romantic-2.jpg";
import romantic3 from "../assets/images/moments/romantic/romantic-3.jpg";
import friends1 from "../assets/images/moments/friends/friends-1.jpg";
import friends2 from "../assets/images/moments/friends/friends-2.jpg";
import friends3 from "../assets/images/moments/friends/friends-3.jpg";
import event1 from "../assets/images/moments/events/event-1.jpg";
import event2Img from "../assets/images/moments/events/event-2.jpg";
import event3 from "../assets/images/moments/events/event-3.jpg";
import event4 from "../assets/images/moments/events/event-4.jpg";

const categories = [
  {
    id: "birthday",
    label: "Birthday Celebration",
    icon: Cake,
    description:
      "Make another year unforgettable at Yāzhi. From the first candle-lit surprise to the last bite of cake, we dress the table, time the reveal, and let you simply enjoy the moment with the people who matter.",
    photos: [
      { src: birthday1, title: "Cake Moment", desc: "The candle-lit reveal, timed just right" },
      { src: birthday2, title: "Birthday Decor", desc: "Balloons, banners & festive table styling" },
      { src: birthday3, title: "Restaurant Ambience", desc: "Warm, celebratory lighting all evening" },
      { src: family1, title: "Table & Food Setup", desc: "Signature dishes plated for the occasion" },
    ],
    pkg: {
      name: "Celebration Bliss — Birthday Package",
      price: "₹4,999 onwards",
      guests: "Up to 10 guests",
      decoration: "Themed table & balloon decoration",
      cake: "Complimentary 1kg celebration cake",
      drink: "Welcome mocktail for all guests",
      dessert: "Special dessert platter",
      message: "Personalized birthday card & table signage",
      duration: "2.5 hours of reserved dining",
    },
  },
  {
    id: "anniversary",
    label: "Anniversary",
    icon: Heart,
    description:
      "Celebrate another year together the way it deserves — a candle-lit table, rose accents, and a menu curated for two. Yāzhi turns your anniversary into a quiet, beautiful evening to remember.",
    photos: [
      { src: anniversary1, title: "Candlelight Table", desc: "An intimate two-seater setup" },
      { src: anniversary2, title: "Elegant Table Setting", desc: "Fine china, soft florals, warm light" },
      { src: anniversary3, title: "Restaurant Ambience", desc: "Refined interiors for a special night" },
      { src: romantic2, title: "The Toast", desc: "Raise a glass to another year together" },
    ],
    pkg: {
      name: "Forever & Always — Anniversary Package",
      price: "₹5,499 onwards",
      guests: "2–8 guests",
      decoration: "Rose petal & candle-lit table styling",
      cake: "Complimentary anniversary cake",
      drink: "Welcome sparkling mocktail",
      dessert: "Chef's special dessert for two",
      message: "Personalized anniversary card",
      duration: "2.5 hours of reserved dining",
    },
  },
  {
    id: "family",
    label: "Family Celebration",
    icon: Users,
    description:
      "Big family, bigger table. Whether it's a reunion, a milestone, or just a Sunday worth celebrating, we set up a warm, generous spread that keeps everyone — from grandparents to grandkids — happily fed.",
    photos: [
      { src: family1, title: "Family Table Setup", desc: "Spacious seating for the whole family" },
      { src: family2, title: "Festive Table Styling", desc: "Warm decor for a family occasion" },
      { src: family3, title: "Restaurant Ambience", desc: "A comfortable space for every generation" },
      { src: event2Img, title: "Shared Feast", desc: "Family-style plating to share and enjoy" },
    ],
    pkg: {
      name: "Together At Yāzhi — Family Package",
      price: "₹6,999 onwards",
      guests: "Up to 12 guests",
      decoration: "Warm, festive table setup",
      cake: "Optional celebration cake add-on",
      drink: "Welcome drinks for the family",
      dessert: "Family-style dessert sharing platter",
      message: "Personalized family greeting card",
      duration: "3 hours of reserved dining",
    },
  },
  {
    id: "romantic",
    label: "Romantic Dinner",
    icon: Wine,
    description:
      "A quiet table, low light, and a menu built for two — Yāzhi sets the scene for date nights that need no occasion at all. Just good food, good wine, and good company.",
    photos: [
      { src: romantic1, title: "Table for Two", desc: "Private, candle-lit corner seating" },
      { src: romantic2, title: "Fine Table Setting", desc: "Soft florals and warm light" },
      { src: romantic3, title: "Evening Ambience", desc: "Romantic lighting all through dinner" },
      { src: anniversary1, title: "Restaurant Interior", desc: "An elegant backdrop for date night" },
    ],
    pkg: {
      name: "Candlelight & Chettinad — Romantic Package",
      price: "₹4,499 onwards",
      guests: "2 guests",
      decoration: "Private candle-lit table for two",
      cake: "Optional dessert-cake for two",
      drink: "Welcome mocktail duo",
      dessert: "Chef's signature dessert to share",
      message: "Personalized love note on the table",
      duration: "2 hours of reserved dining",
    },
  },
  {
    id: "friends",
    label: "Friends Gathering",
    icon: PartyPopper,
    description:
      "Reunions, farewells, or just another Friday — bring the whole group in and let us handle the table. Big portions, shared plates, and an atmosphere built for good conversation.",
    photos: [
      { src: friends1, title: "Cheers!", desc: "Toasting to the whole squad" },
      { src: friends2, title: "Group Table Setup", desc: "Seating designed for larger groups" },
      { src: friends3, title: "Shared Spread", desc: "Dishes made for passing around the table" },
      { src: event1, title: "Restaurant Ambience", desc: "A lively, comfortable setting" },
    ],
    pkg: {
      name: "Squad Feast — Friends Package",
      price: "₹3,999 onwards",
      guests: "Up to 10 guests",
      decoration: "Fun, vibrant table styling",
      cake: "Optional celebration cake add-on",
      drink: "Welcome mocktail for the group",
      dessert: "Shared dessert sampler",
      message: "Custom group photo card",
      duration: "2.5 hours of reserved dining",
    },
  },
  {
    id: "events",
    label: "Special Events",
    icon: Sparkles,
    description:
      "For launches, milestones, and celebrations that call for something bigger — our team works with you on styling, seating, and the menu to make sure the event runs exactly as planned.",
    photos: [
      { src: event1, title: "Event Setup", desc: "Flexible seating for larger gatherings" },
      { src: event3, title: "Restaurant Ambience", desc: "A premium backdrop for any event" },
      { src: event4, title: "Curated Experience", desc: "Menus tailored to the occasion" },
      { src: birthday1, title: "Celebration Cake", desc: "Custom cakes for milestone moments" },
    ],
    pkg: {
      name: "Grand Celebration — Special Events Package",
      price: "Custom pricing",
      guests: "10+ guests",
      decoration: "Fully customized event styling",
      cake: "Custom celebration cake",
      drink: "Welcome beverage service",
      dessert: "Curated dessert station",
      message: "Personalized event signage",
      duration: "Flexible duration",
    },
  },
];

const MomentsCelebrated = () => {
  const [activeId, setActiveId] = useState(categories[0].id);
  const active = categories.find((c) => c.id === activeId);

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-10 justify-start md:justify-center">
        {categories.map((c) => {
          const Icon = c.icon;
          const isActive = c.id === activeId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveId(c.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 ${
                isActive
                  ? "bg-charcoal text-cream border-charcoal shadow-premium"
                  : "bg-white text-charcoal/60 border-charcoal/10 hover:border-gold hover:text-goldDark"
              }`}
            >
              <Icon size={16} className={isActive ? "text-gold" : ""} />
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Active category panel */}
      <div key={active.id} className="animate-fade-in-up">
        <div className="grid lg:grid-cols-2 gap-5 mb-10">
          {active.photos.map((p, i) => (
            <InteractiveImage
              key={i}
              src={p.src}
              title={p.title}
              description={p.desc}
              actionLabel="Explore"
              onAction={() => {}}
              className="h-56"
            />
          ))}
        </div>
        <p className="text-center text-[11px] uppercase tracking-widest text-charcoal/35 -mt-6 mb-10">
  happy moments, made memorable at Yāzhi — யாழி
</p>
       

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Description */}
          <div className="card-premium p-8 flex flex-col justify-center">
            <p className="eyebrow mb-3">{active.label} at Yāzhi</p>
            <h3 className="font-display text-2xl mb-4">A Celebration Made For You</h3>
            <p className="text-charcoal/65 leading-relaxed">{active.description}</p>
          </div>

          {/* Package */}
          <div className="bg-charcoal-gradient text-cream rounded-2xl p-8 shadow-premium relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gold/10 blur-3xl" />
            <div className="relative">
              <p className="eyebrow mb-2">Celebration Package</p>
              <h3 className="font-display text-xl mb-1">{active.pkg.name}</h3>
              <p className="text-gold font-semibold mb-5">{active.pkg.price}</p>
              <ul className="space-y-2.5 mb-7 text-sm text-cream/80">
                <PkgRow icon={Users} label={active.pkg.guests} />
                <PkgRow icon={Sparkles} label={active.pkg.decoration} />
                <PkgRow icon={Cake} label={active.pkg.cake} />
                <PkgRow icon={Wine} label={active.pkg.drink} />
                <PkgRow icon={Utensils} label={active.pkg.dessert} />
                <PkgRow icon={Gift} label={active.pkg.message} />
                <PkgRow icon={Clock} label={active.pkg.duration} />
              </ul>
              <Link to="/book-table" className="btn-gold w-full sm:w-auto">
                Book This Package <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PkgRow = ({ icon: Icon, label }) => (
  <li className="flex items-start gap-3">
    <span className="mt-0.5 text-gold shrink-0"><Icon size={15} /></span>
    <span>{label}</span>
  </li>
);

export default MomentsCelebrated;
