import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Leaf, Flame, Gem, HeartHandshake, ArrowRight,
  MapPin, Phone, Clock, ChevronRight, Navigation, ChefHat,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import MenuCard from "../components/MenuCard";
import InteractiveImage from "../components/InteractiveImage";
import MomentsCelebrated from "../components/MomentsCelebrated";
import ChefsSection from "../components/ChefsSection";
import ReviewsSlider from "../components/ReviewsSlider";
import Reveal from "../components/brand/Reveal";
import Parallax from "../components/brand/Parallax";
import TamilTag from "../components/brand/TamilTag";
import { KolamDivider, KolamCorner } from "../components/brand/KolamMotif";
import ElephantMotif from "../components/brand/ElephantMotif";
import BananaLeafAccent from "../components/brand/BananaLeafAccent";

import heroImg from "../assets/images/hero/hero.jpg";
import heritageImg from "../assets/images/about/about-1.jpg";
import exquisiteImg from "../assets/images/hero/home-section.jpg";
import interior1 from "../assets/images/interior/interior-1.jpg";
import interior2 from "../assets/images/interior/interior-2.jpg";
import interior3 from "../assets/images/interior/interior-3.jpg";
import interior4 from "../assets/images/interior/interior-4.jpg";
import interior5 from "../assets/images/interior/interior-5.jpg";
import ctaImg from "../assets/images/interior/interior-6.jpg";

const RESTAURANT_ADDRESS =
  "34 Nehru Street, Kalpalayam, Vinayagapuram, Chennai - 600099, Tamil Nadu, India";
const MAPS_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  RESTAURANT_ADDRESS
)}&output=embed`;
const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  RESTAURANT_ADDRESS
)}`;

const Home = () => {
  const { axios } = useApp();
  const [signatureDishes, setSignatureDishes] = useState([]);

  useEffect(() => {
    axios
      .get("/api/menu")
      .then(({ data }) => data.success && setSignatureDishes(data.menus.slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ---------------- HERO ---------------- */}
      <section className="relative h-[92vh] min-h-[600px] flex items-center justify-center text-center text-cream overflow-hidden">
        <Parallax speed={0.12} className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{
              backgroundImage: `linear-gradient(rgba(15,20,32,0.6), rgba(15,20,32,0.85)), url(${exquisiteImg})`,
            }}
          />
        </Parallax>

        <div className="relative max-w-2xl px-4 animate-fade-in-up">
          <svg width="50" height="50" viewBox="0 0 512 512" fill="currentColor" className="text-gold mx-auto mb-2">
  <path d="M256,350.349l-0.001-0.001L256,350.349z"/>
  <path d="M256,350.349l0.001-0.001L256,350.349z"/>
  <path d="M256,94.349c0,0-67.301,57.307-67.301,128s67.301,128,67.301,128s67.301-57.307,67.301-128S256,94.349,256,94.349z"/>
  <path d="M195.334,332.483c-11.322-15.587-20.403-31.598-26.991-47.59c-8.648-20.99-13.034-42.033-13.034-62.543
    c0-13.635,1.95-27.504,5.789-41.438c-43.015-15.027-86.116-11.581-86.116-11.581s-7.067,88.111,42.921,138.099
    c25.49,25.49,60.889,36.139,89.466,40.461C203.482,343.253,199.414,338.101,195.334,332.483z"/>
  <path d="M178.096,376.052c-34.412-8.672-62.609-23.815-83.806-45.013c-9.641-9.641-18.07-20.827-25.207-33.395
    C28.041,317.434,0,350.349,0,350.349s57.307,67.301,128,67.301c36.05,0,68.614-17.501,91.877-34.656
    C207.406,381.904,193.082,379.828,178.096,376.052z"/>
  <path d="M437.019,169.331c0,0-43.102-3.446-86.116,11.581c3.839,13.933,5.789,27.803,5.789,41.438
    c0,20.51-4.385,41.553-13.034,62.543c-6.588,15.992-15.669,32.003-26.991,47.59c-4.08,5.619-8.149,10.77-12.035,15.408
    c28.577-4.322,63.977-14.972,89.466-40.461C444.085,257.441,437.019,169.331,437.019,169.331z"/>
  <path d="M442.917,297.645c-7.137,12.567-15.566,23.753-25.207,33.395c-21.197,21.198-49.394,36.341-83.806,45.013
    c-14.986,3.777-29.31,5.852-41.781,6.943c23.264,17.154,55.827,34.656,91.877,34.656c70.693,0,128-67.301,128-67.301
    S483.959,317.434,442.917,297.645z"/>
</svg>
          <TamilTag en="Modern Tamil Heritage Dining · Since 2026" ta="பாரம்பரியம் சுவை" className="mb-5" />
          <h1 className="font-display text-5xl md:text-7xl mb-2 leading-tight">
            <span className="text-gold">Yāzhi</span>
          </h1>
          <p className="font-tamil-display text-2xl md:text-3xl text-brassLight/90 mb-6">யாழி</p>

          <p className="text-cream/80 mb-9 text-xl">
            Where the melody of Tamil heritage meets the art of food, served with modern luxury.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/menu" className="btn-gold">Explore Menu <ArrowRight size={16} /></Link>
            <Link to="/book-table" className="btn-outline-cream">Book a Table</Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float-slow text-cream/50">
          <ChevronRight size={22} className="rotate-90" />
        </div>
      </section>

      {/* ---------------- INTRODUCTION / WHAT MAKES US UNIQUE ---------------- */}
      <section className="max-w-7xl mx-auto px-4 py-24 text-center relative">
        <Reveal>
          <TamilTag en="Why Yāzhi"  className="mb-3" />
          <h2 className="section-title mb-3">What Makes Us Unique</h2>
          <KolamDivider className="mb-14" />
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          <Reveal delay={0} className="h-full" ><Feature icon={<Leaf size={26} />} title="Fresh Ingredients" desc="Sourced daily from trusted local farms for maximum flavour and quality." /></Reveal>
          <Reveal delay={80} className="h-full" ><Feature icon={<Flame size={26} />} title="Authentic Flavours" desc="Traditional Tamil recipes crafted by chefs who honour every region's true taste." /></Reveal>
          <Reveal delay={160} className="h-full" ><Feature icon={<Gem size={26} />} title="Premium Dining" desc="An elegant, temple-inspired space designed for memorable evenings." /></Reveal>
          <Reveal delay={240} className="h-full" ><Feature icon={<HeartHandshake size={26} />} title="Warm Hospitality" desc="Virundhombal — the Tamil spirit of hospitality — in every visit." /></Reveal>
        </div>
      </section>

      {/* ---------------- HERITAGE ---------------- */}
      <section className="bg-charcoal-gradient text-cream py-24 relative overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-14 items-center relative">
          <Reveal variant="scale" className="relative order-2 md:order-1">
            <img
              src={heritageImg}
              alt="Yāzhi heritage dining interior"
              className="rounded-2xl shadow-premium w-full h-96 object-cover"
            />
            <KolamCorner className="absolute -bottom-4 -left-4 w-16 h-16 text-gold/60 hidden sm:block" />
          </Reveal>
          <Reveal className="order-1 md:order-2">
            <TamilTag en="Heritage" ta="பாரம்பரியம்" align="left" className="mb-4" />
            <h2 className="font-display text-3xl md:text-4xl mb-5">Rooted in Tamil Tradition</h2>
            <p className="text-cream/70 leading-relaxed mb-6">
              Yāzhi takes its name from the yāḻ, an ancient Tamil string instrument — a symbol of
              artistry passed down through generations. Every corner of our dining room, from the
              brass kuthu vilakku to the woven kolam at your feet, is a quiet tribute to that
              heritage — marabu, reimagined for a modern table.
            </p>
            <div className="flex items-center gap-4">
              <svg width="80" height="80" viewBox="0 0 612.016 612.016" fill="currentColor" className="text-gold ">
  <path d="M476.062,35.829c-20.72,0-39.913,6.518-57.239,19.407c-16.018-19.054-31.269-24.86-33.25-25.556l-2.237-0.783h-154.67
    l-2.242,0.789c-1.982,0.695-17.232,6.501-33.245,25.555c-17.331-12.889-36.52-19.406-57.239-19.406
    c-68.81,0-129.11,73.013-131.648,76.121L0,117.217l15.344,67.663l10.58,0.514c0.176,0.011,17.964,1.204,38.953,14.171
    c12.77,7.887,24.082,18.488,33.619,31.507c12.205,16.656,21.555,37.37,27.797,61.566l6.574,25.483l17.393-19.754
    c0.146-0.167,12.132-13.771,31.476-35.186c6.746,16.288,10.45,29.566,11.711,41.615c1.65,15.759-0.669,30.646-7.747,49.783
    l-5.937,16.049l21.991,3.347c-6.507,14.722-19.625,36.063-43.12,44.257l-31.606,11.026l30.091,14.669
    c0.778,0.379,19.323,9.309,43.078,11.058c2.761,0.202,5.474,0.306,8.152,0.306c18.343,0,34.688-4.769,48.485-14.046l2.216,38.31
    l-49.398,24.035l-0.291,8.385c-0.737,21.415,4.686,38.269,16.112,50.094c20.179,20.886,53.295,21.052,82.68,21.052
    c0.244,0,0.493,0,0.737,0h0.736c17.798,0,31.242-4.577,39.955-13.605c8.358-8.666,9.262-18.265,9.304-21.57l5.007-105.641
    c13.449,8.582,29.229,12.987,46.855,12.987c2.673,0,5.392-0.099,8.146-0.306c23.755-1.754,42.301-10.679,43.079-11.058
    l30.09-14.669l-31.605-11.026c-15.115-5.272-27.786-16.579-37.656-33.609c-2.387-4.119-4.322-8.104-5.863-11.664l15.308-2.33
    l-5.937-16.049c-7.077-19.137-9.392-34.023-7.747-49.783c1.261-12.054,4.966-25.327,11.717-41.615
    c19.344,21.419,31.331,35.02,31.476,35.186l17.394,19.754l6.574-25.483c6.134-23.775,15.271-44.199,27.169-60.7
    c9.351-12.972,20.444-23.599,32.976-31.58c20.958-13.346,39.238-14.892,40.271-14.97l10.502-0.374l15.375-67.803l-4.291-5.267
    C605.177,108.848,544.871,35.829,476.062,35.829z M203.021,427.233c-1.749-0.113-3.471-0.279-5.147-0.487
    c17.476-15.557,27.299-35.56,32.233-48.459l23.288,3.544l1.359,23.47C242.358,421.271,224.97,428.655,203.021,427.233z
    M335.017,462.373h-21.804v27.886h20.48c-0.067,1.396-2.319,48.926-2.485,52.428c-0.125,2.59,0.363,5.646-1.687,7.648
    c-2.164,2.112-5.199,3.005-8.069,3.7c-3.865,0.934-7.876,1.204-11.841,1.204h-0.742c-5.739,0.005-11.675,0-17.538-0.172
    l-9.766-168.95l-0.176-3.062h57.378l-0.083,1.806l-1.52,32.099h-36.38v27.885h35.057L335.017,462.373z M256.301,511.896
    l24.237,42.61c-14.534-1.156-27.605-4.135-35.025-11.814c-4.774-4.945-7.472-12.044-8.167-21.576L256.301,511.896z
    M340.097,355.17H279.78l-1.074-18.551h62.267L340.097,355.17z M421.215,426.75c-1.433,0.177-2.891,0.322-4.375,0.431
    c-21.596,1.594-38.823-5.251-51.276-20.346l1.245-26.25l21.788-3.316C393.396,390.117,403.271,410.774,421.215,426.75z
    M573.913,159.107c-9.719,2.008-24.942,6.543-41.443,16.734c-15.837,9.786-29.784,22.821-41.454,38.751
    c-9.952,13.584-18.239,29.291-24.762,46.897c-7.695-8.593-17.782-19.801-29.623-32.809l-13.891-15.261l-8.978,18.582
    c-13.792,28.554-20.869,50.114-22.939,69.895c-1.588,15.177-0.322,29.904,4.109,46.202l-26.78,4.073l2.48-52.325
    c0.363-7.69-5.572-14.223-13.268-14.586c-7.68-0.374-14.223,5.573-14.586,13.268l-0.031,0.659l-0.452,9.548h-65.198l-0.55-9.548
    l-0.047-0.805c-0.446-7.69-7.036-13.559-14.721-13.112c-7.69,0.446-13.559,7.036-13.112,14.726l3.087,53.378l-34.678-5.271
    c4.432-16.299,5.698-31.024,4.11-46.203c-2.07-19.785-9.143-41.34-22.94-69.894l-8.977-18.582l-13.891,15.26
    c-11.841,13.009-21.934,24.217-29.624,32.81c-6.522-17.606-14.809-33.312-24.761-46.897c-11.67-15.93-25.618-28.964-41.455-38.75
    c-16.5-10.196-31.725-14.731-41.443-16.734l-7.83-34.527c5.614-6.19,16.334-17.29,30.313-28.399
    c18.644-14.809,46.851-32.467,75.364-32.467c18.405,0,34.724,7.14,49.875,21.83l12.199,11.82l9.215-14.27
    c11.006-17.045,22.385-24.077,26.765-26.313h144.008c4.379,2.236,15.759,9.268,26.764,26.313l9.216,14.27l12.199-11.82
    c15.156-14.69,31.471-21.83,49.876-21.83c46.389,0,91.724,45.543,105.672,60.886L573.913,159.107z"/>
  <path d="M370.736,178.503c-14.757,0-26.723,11.965-26.723,26.723v39.176c6.569-6.574,12.646-12.625,18.229-18.171
    c4.654,2.963,10.855,4.411,17.44,3.622c12.857-1.546,22.297-11.037,21.077-21.196c-0.607-5.07-3.757-9.351-8.359-12.173
    c12.438-12.168,18.529-17.979,18.529-17.979H370.736L370.736,178.503z"/>
  <path d="M248.481,178.503h-40.193c0,0,6.097,5.812,18.53,17.979c-4.603,2.823-7.747,7.104-8.359,12.173
    c-1.219,10.16,8.214,19.655,21.077,21.196c6.585,0.789,12.786-0.659,17.44-3.622c5.583,5.547,11.66,11.602,18.229,18.171v-39.176
    C275.204,190.469,263.244,178.503,248.481,178.503z"/>
  <path d="M165.988,111.883c-0.638,1.619-15.582,40.001-7.135,73.361l27.029-6.844c-6.211-24.538,5.92-55.962,6.04-56.279
    l-12.972-5.106L165.988,111.883z"/>
  <path d="M418.941,122.121c0.125,0.316,12.251,31.741,6.04,56.279l27.029,6.844c8.442-33.359-6.497-71.742-7.135-73.361
    L418.941,122.121z"/>
</svg>
              <p className="font-tamil text-yellow-600 text-lg">மரபு — Marabu</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- SIGNATURE MENU / TASTE ---------------- */}
      <section className="bg-ivory py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal className="text-center mb-14">
            <TamilTag en="Taste The Best" ta="சுவை" className="mb-3" />
            <h2 className="section-title mb-3">Our Signature Menu</h2>
            <KolamDivider />
          </Reveal>
          {signatureDishes.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {signatureDishes.map((item, i) => (
                <Reveal key={item._id} delay={i * 70}><MenuCard item={item} /></Reveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-charcoal/40 py-10">Our signature dishes are being plated — check back shortly.</p>
          )}
          <div className="text-center mt-14">
            <Link to="/menu" className="btn-dark">View Full Menu <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ---------------- ATMOSPHERE ---------------- */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <Reveal className="text-center mb-14">
          <TamilTag en="Step Inside" ta="உள்ளே வாருங்கள்" className="mb-3" />
          <h2 className="section-title mb-3">The Atmosphere of Yāzhi</h2>
          <KolamDivider />
        </Reveal>
        <div className="grid md:grid-cols-4 grid-cols-2 gap-4 h-[560px] md:h-[420px]">
          <InteractiveImage
            src={interior1}
            title="Temple-Inspired Dining Hall"
            description="Brass, wood and warm light throughout"
            className="col-span-2 row-span-2 h-full"
          />
          <InteractiveImage
            src={interior2}
            title="Kuthu Vilakku Ambience"
            description="Traditional brass lamps set the mood"
            className="h-full hidden md:block"
          />
          <InteractiveImage
            src={interior3}
            title="Heritage Table Setting"
            description="Every table styled with care"
            className="h-full hidden md:block"
          />
          <InteractiveImage
            src={interior4}
            title="Dining Room Interior"
            description="A warm, welcoming space to gather"
            className="h-full"
          />
          <InteractiveImage
            src={interior5}
            title="Contemporary Tamil Elegance"
            description="Modern design meets timeless craft"
            className="h-full"
          />
        </div>
      </section>

      {/* ---------------- EXQUISITE EXPERIENCE ---------------- */}
      <section className="bg-charcoal-gradient text-cream py-24 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-14 items-center relative">
          <Reveal>
            <TamilTag en="Beyond the Meal" ta="விருந்தோம்பல்" align="left" className="mb-4 " />
            <h2 className="font-display text-3xl md:text-4xl mb-5">An Exquisite Dining Experience</h2>
            <p className="text-cream/70 leading-relaxed mb-8">
              At Yāzhi, every visit is composed like a fine piece of music — from the first warm
              welcome to the last bite of dessert. Our chefs, servers, and ambience work together
              to create moments that linger long after the table is cleared.
            </p>
            <div className="grid grid-cols-3 gap-6">
              <Stat value="15+" label="Signature Dishes" />
              <Stat value="4.9" label="Average Rating" />
              <Stat value="10k+" label="Happy Guests" />
            </div>
          </Reveal>
          <Reveal variant="scale" className="relative">
            <img
              src={heroImg}
              alt="Exquisite dining experience at Yāzhi"
              className="rounded-2xl shadow-premium w-full h-96 object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-gold text-charcoal rounded-2xl px-6 py-4 shadow-gold hidden sm:block">
              <p className="font-display text-2xl leading-none">A+</p>
              <p className="text-xs font-semibold">Hygiene Rating</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- MOMENTS CELEBRATED / INTERACTIVE GALLERY ---------------- */}
      <section className="max-w-7xl mx-auto px-4 py-24 relative">
        <BananaLeafAccent className="hidden lg:block absolute -left-6 top-10 w-28 h-28 text-banana/15 -scale-x-100" />
        <Reveal className="text-center mb-14">
          <TamilTag en="Every Occasion" ta="ஒவ்வொரு நிகழ்வும்" className="mb-3" />
          <h2 className="section-title mb-3">Moments Celebrated at Yāzhi</h2>
          <KolamDivider />
        </Reveal>
        <MomentsCelebrated />
      </section>

      {/* ---------------- MEET OUR CHEFS ---------------- */}
      <section className="bg-ivory py-24">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal className="text-center mb-4">
            <h2 className="section-title mb-3 inline-flex items-center gap-3">
              <ChefHat className="text-gold" size={30} /> Meet Our Chefs-
            </h2>
            <TamilTag en="The Hands Behind Every Dish" ta="சமையல் கலைஞர்கள்" className="mb-3" />
            
            <KolamDivider />
          </Reveal>
          <ChefsSection />
        </div>
      </section>

      {/* ---------------- CUSTOMER REVIEWS ---------------- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal className="text-center mb-14">
            <TamilTag en="Loved By Guests" ta="விருந்தினர்கள் விரும்புவது" className="mb-3" />
            <h2 className="section-title mb-3">What Our Customers Say</h2>
            <KolamDivider />
          </Reveal>
          <ReviewsSlider />
        </div>
      </section>

      {/* ---------------- LOCATION / MAP ---------------- */}
      <section className="bg-ivory max-w-7xl mx-auto px-4 py-24 rounded-3xl">
        <Reveal className="text-center mb-14">
          <TamilTag en="Find Us" className="mb-3" />
          <h2 className="section-title mb-3">Our Location</h2>
          <KolamDivider />
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          <div className="relative z-10 bg-ivory rounded-2xl overflow-hidden shadow-premium h-80 md:h-full min-h-[320px]">
            <iframe
              title="Yāzhi Location"
              src={MAPS_EMBED_SRC}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="card-premium p-8 flex flex-col justify-center gap-6">
            <div className="flex items-start gap-4">
              <span className="bg-gold/15 text-goldDark rounded-full p-3"><MapPin size={20} /></span>
              <div>
                <p className="font-semibold">Address</p>
                <p className="text-charcoal/60 text-sm">{RESTAURANT_ADDRESS}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="bg-gold/15 text-goldDark rounded-full p-3"><Phone size={20} /></span>
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-charcoal/60 text-sm">+91 8111000241</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="bg-gold/15 text-goldDark rounded-full p-3"><Clock size={20} /></span>
              <div>
                <p className="font-semibold">Opening Hours</p>
                <p className="text-charcoal/60 text-sm">Monday – Sunday, 11:00 AM – 11:00 PM</p>
              </div>
            </div>
            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-dark w-full sm:w-auto justify-center"
            >
              <Navigation size={16} /> Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- RESERVE A TABLE CTA ---------------- */}
      <section className="relative py-24 text-center text-cream overflow-hidden">
        <Parallax speed={0.08} className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{
              backgroundImage: `linear-gradient(rgba(161,29,46,0.82), rgba(15,20,32,0.9)), url(${ctaImg})`,
            }}
          />
        </Parallax>
        <div className="relative max-w-2xl mx-auto px-4">
          <TamilTag en="Reserve Your Evening" ta="யாழி — தமிழின் சுவையை இசையாக்கும் விருந்து" className="mb-3" />
          <h2 className="font-display text-3xl md:text-5xl mb-6">Your Table Is Waiting</h2>
          <p className="text-cream/80 mb-9">
            Pick your favourite seat with our interactive table map and secure your spot in minutes.
          </p>
          <Link to="/book-table" className="btn-gold text-base px-8 py-4">
            Reserve a Table <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="card-premium p-7 text-center h-full flex flex-col">
    <div className="w-14 h-14 mx-auto rounded-full bg-gold/15 text-goldDark flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="font-semibold font-display text-lg mb-2">{title}</h3>
    <p className="text-sm text-charcoal/60 leading-relaxed">{desc}</p>
  </div>
);

const Stat = ({ value, label }) => (
  <div>
    <p className="font-display text-3xl text-gold">{value}</p>
    <p className="text-xs text-cream/60 mt-1">{label}</p>
  </div>
);

export default Home;
