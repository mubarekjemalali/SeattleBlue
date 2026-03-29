import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const fleetItems = [
  {
    title: "Sedans",
    text: "Comfortable daily rides for airport transfers, city trips, appointments, and reliable transportation across Seattle.",
    image: "/side_shot1.png",
  },
  {
    title: "SUVs",
    text: "Extra room for families, travelers, and customers who need additional luggage space with a smooth and comfortable ride.",
    image: "/side_shot1.png",
  },
  {
    title: "Vans",
    text: "A practical choice for group transportation, larger parties, airport pickups, and customers traveling with more bags.",
    image: "/side_shot1.png",
  },
];

const serviceHighlights = [
  "Airport transportation",
  "Flat-rate routes",
  "City rides",
  "SUV and van service",
  "Professional drivers",
  "Simple online booking",
];

export default function AboutPage() {
  const navigate = useNavigate();

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
      <Navbar brand={brand} />

      {/* Hero */}
      <section className="section aboutHeroSection">
        <div className="container aboutHeroLayout">
          <div className="aboutHeroText">


            <h1 className="aboutHeroTitle">
              Seattle Blue Cab is built around dependable service, professional rides, and a better booking experience.
            </h1>

            <p className="aboutHeroBody">
              We provide trusted local transportation for airport trips, city rides, and larger vehicle needs. Our goal is
              simple: make booking easier, communicate clearly, and deliver service customers feel confident using again.
            </p>

            <div className="aboutHeroActions">
              <button className="btn btnPrimary" onClick={() => navigate("/booking")}>
                Book a Ride
              </button>
              <button className="btn btnGhost aboutHeroGhostBtn" onClick={() => navigate("/contact")}>
                Contact Us
              </button>
              <button className="btn btnGhost aboutHeroGhostBtn" onClick={() => navigate("/")}>
                Home
              </button>
            </div>
          </div>

          <div className="aboutHeroMedia card">
            <img
              src="/side_shot1.png"
              alt="Seattle Blue Cab vehicle"
              className="aboutHeroImage"
            />
          </div>
        </div>
      </section>

      {/* Intro profile */}
      <section className="section aboutSectionTight">
        <div className="container aboutProfileGrid">
          <div className="card aboutDarkCard">
            <div className="aboutSectionLabel">Who we are</div>
            <h2 className="aboutSectionTitleLight">A local cab company focused on clarity, trust, and reliability.</h2>
            <p className="aboutSectionBodyLight">
              Seattle Blue Cab serves riders who want transportation that is straightforward to book and dependable to use.
              We focus on giving customers a professional ride experience from the moment they visit the website to the
              moment they reach their destination.
            </p>
            <p className="aboutSectionBodyLight">
              Whether the ride is scheduled in advance or needed for airport travel, our approach is centered on responsive
              communication, practical vehicle options, and service customers can rely on.
            </p>
          </div>

          <div className="card aboutLightFeatureCard">
            <div className="aboutSectionLabelBlue">What we value</div>
            <div className="aboutValueList">
              <div className="aboutValueItem">✅ On-time, dependable service</div>
              <div className="aboutValueItem">✅ Clear communication</div>
              <div className="aboutValueItem">✅ Safe, professional transportation</div>
              <div className="aboutValueItem">✅ Simple online booking</div>
              <div className="aboutValueItem">✅ Vehicle options for different customer needs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience / positioning */}
      <section className="section aboutSectionTight">
        <div className="container">
          <div className="card aboutStatementCard">
            <div className="aboutSectionLabelBlue">Our experience</div>
            <h2 className="aboutSectionTitleDark">
              Built to support real transportation needs across Seattle.
            </h2>
            <p className="aboutSectionBodyDark">
              Customers need more than just a ride. They need a service they can understand, trust, and return to.
              That means reliable airport transportation, clear pickup expectations, responsive support, and vehicle
              choices that fit different trip types.
            </p>
            <p className="aboutSectionBodyDark">
              Seattle Blue Cab is designed to support that experience with a cleaner booking process, stronger customer
              communication, and a more organized operation behind the scenes.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section aboutSectionTight">
        <div className="container">
          <div className="aboutBlockHeader">
            <div className="aboutSectionLabelBlue">Services provided</div>
            <h2 className="aboutBlockTitle">Transportation options for everyday and scheduled travel</h2>
            <p className="aboutBlockBody">
              We support a wide range of ride needs, from airport transfers to local city transportation and larger-vehicle requests.
            </p>
          </div>

          <div className="aboutServicesGrid">
            {serviceHighlights.map((item) => (
              <div key={item} className="card aboutServiceCard">
                <div className="aboutServiceTitle">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section className="section aboutSectionTight">
        <div className="container">
          <div className="aboutBlockHeader">
            <div className="aboutSectionLabelBlue">Fleet</div>
            <h2 className="aboutBlockTitle">Vehicles for different ride sizes and travel needs</h2>
            <p className="aboutBlockBody">
              Our fleet includes practical options for solo riders, airport travelers, families, and customers who need more luggage or passenger capacity.
            </p>
          </div>

          <div className="aboutFleetGrid">
            {fleetItems.map((item) => (
              <div key={item.title} className="card aboutFleetGridCard">
                <img
                  src={item.image}
                  alt={item.title}
                  className="aboutFleetImage"
                />
                <div className="aboutFleetBody">
                  <div className="aboutFleetTitle">{item.title}</div>
                  <div className="aboutFleetText">{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section aboutSectionTight">
        <div className="container aboutProfileGrid">
          <div className="card aboutLightFeatureCard">
            <div className="aboutSectionLabelBlue">Why customers choose us</div>
            <h2 className="aboutSectionTitleDark">A better balance of simplicity, professionalism, and trust.</h2>
            <p className="aboutSectionBodyDark">
              Riders want transportation that is easy to book, easy to understand, and delivered professionally.
              We focus on reducing confusion, improving trip visibility, and making it easier for customers to get the
              right vehicle for the right trip.
            </p>
            <p className="aboutSectionBodyDark">
              Our aim is to create a service experience that feels dependable from start to finish.
            </p>
          </div>

          <div className="card aboutCtaCard">
            <div className="aboutSectionLabelLight">Ready to ride?</div>
            <h2 className="aboutSectionTitleLight">Book online, contact us, or return to the homepage.</h2>
            <p className="aboutSectionBodyLight">
              Whether you are planning an airport trip, a city ride, or just want to learn more first, the next step is simple.
            </p>

            <div className="aboutHeroActions">
              <button className="btn btnPrimary" onClick={() => navigate("/booking")}>
                Book Now
              </button>
              <button className="btn btnGhost aboutHeroGhostBtn" onClick={() => navigate("/contact")}>
                Contact Us
              </button>
              <button className="btn btnGhost aboutHeroGhostBtn" onClick={() => navigate("/")}>
                Home
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer brand={brand} />
    </div>
  );
}