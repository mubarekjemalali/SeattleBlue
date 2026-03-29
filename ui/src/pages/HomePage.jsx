import { useMemo, useRef } from "react";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BookingTeaser from "../components/BookingTeaser";
import FleetPreview from "../components/FleetPreview";
import Footer from "../components/Footer";

export default function HomePage() {
  const bookingRef = useRef(null);

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const brand = useMemo(
    () => ({
      companyName: "Seattle Blue Cab",
      phoneDisplay: "(206) 555-0123",
      phoneDial: "+12065550123",
      email: "info@seattlebluecab.com",
      addressShort: "Seattle, WA",
      socials: {
        facebook: "#",
        instagram: "#",
        x: "#",
      },
    }),
    []
  );

  return (
    <div>
      <TopBar brand={brand} />
      {/* Navbar now uses router links; Book Now goes to /booking */}
      <Navbar brand={brand} onBookNow={scrollToBooking} />

      <Hero brand={brand} onBookNow={scrollToBooking} />

      {/* Booking teaser stays on homepage for quick entry, but Continue goes to /booking with query params */}
      <div ref={bookingRef}>
        <BookingTeaser />
      </div>

      <FleetPreview onBookNow={scrollToBooking} />

      <Footer brand={brand} />
    </div>
  );
}
