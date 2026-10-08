import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Pill,
  HeartPulse,
  Phone,
  Mail,
  MessageCircle,
  Facebook,
  Instagram,
  MapPin,
  Clock,
  Search,
  Info,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import logo from "./public/logo.jpg";
import "./styles.css";

const products = [
  ["Paracetamol 500 mg", "Pain & Fever", 3.5, "per tablet"],
  ["Vitamin C 500 mg", "Vitamins", 8, "per tablet"],
  ["Cetirizine 10 mg", "Allergy", 5, "per tablet"],
  ["Omeprazole 20 mg", "Gastro", 7.5, "per capsule"],
  ["Oral Rehydration Salts", "First Aid", 18, "per sachet"],
  ["Alcohol 70% 500 mL", "First Aid", 55, "per bottle"],
  ["Multivitamins", "Vitamins", 12, "per tablet"],
  ["Antacid Tablets", "Gastro", 6, "per tablet"],
];
const cats = ["All", ...new Set(products.map((p) => p[1]))];

export default function App() {
  const [tab, setTab] = useState("home"),
    [q, setQ] = useState(""),
    [cat, setCat] = useState("All"),
    [page, setPage] = useState(1);

  const itemsPerPage = 10;

  const list = useMemo(
    () =>
      products.filter(
        (p) =>
          (cat === "All" || p[1] === cat) &&
          (!q ||
            p[0].toLowerCase().includes(q.toLowerCase()) ||
            p[1].toLowerCase().includes(q.toLowerCase())),
      ),
    [q, cat],
  );

  const totalPages = Math.ceil(list.length / itemsPerPage);

  const paginatedList = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  }, [list, page]);
  const go = (t) => {
    setTab(t);
    scrollTo({ top: 0, behavior: "smooth" });
  };
  const save = () => {
    const v = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:Farmacia Mercidita",
      "ORG:Farmacia Mercidita",
      "TEL:+639123456789",
      "EMAIL:yourpharmacy@email.com",
      "URL:https://yourbrand.com/pharmacy",
      "END:VCARD",
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([v], { type: "text/vcard" }));
    a.download = "your-pharmacy.vcf";
    a.click();
  };
  return (
    <div className="app">
      <header>
        <div className="brand">
          <div className="logo">
            <img src={logo} alt="Farmacia Mercidita logo" />
          </div>
          <div>
            <b>Farmacia Mercidita</b>
            <small>Kalusugan ay Maligaya sa Gamot na Abot Kaya</small>
          </div>
        </div>
        <button onClick={() => go("price")}>
          <ShoppingBag /> Price List
        </button>
      </header>
      {tab === "home" && (
        <main>
          <section className="hero">
            <label>
              <HeartPulse /> Community Pharmacy
            </label>
            <h1>
              Kalusugan ay <br />
              <span>Maligaya.</span>
            </h1>
            <p>
              Quality medicines, wellness essentials, and friendly service from
              Farmacia Mercidita.
            </p>
            <div className="actions">
              <button className="primary" onClick={() => go("price")}>
                Browse Price List <ChevronRight />
              </button>
              <button className="secondary" onClick={() => go("contact")}>
                Contact Us
              </button>
            </div>
          </section>
          <section className="quick">
            <button onClick={() => go("price")}>
              <Pill />
              <b>Price List</b>
              <small>Check prices</small>
            </button>
            <a href="tel:+639123456789">
              <Phone />
              <b>Call Us</b>
              <small>+63 912 345 6789</small>
            </a>
            <a href="https://m.me/farmacia.mercidita" target="_blank">
              <MessageCircle />
              <b>Messenger</b>
              <small>Chat with us</small>
            </a>
            <button onClick={save}>
              <ShoppingBag />
              <b>Save Contact</b>
              <small>Add to phone</small>
            </button>
          </section>
          <div className="card">
            <Clock />
            <div>
              <b>Store Hours</b>
              <p>
                Mon–Sat · 8:00 AM–8:00 PM
                <br />
                Sunday · 9:00 AM–5:00 PM
              </p>
            </div>
          </div>
          <div className="notice">
            <Info />
            <p>
              <b>Price notice:</b> Sample prices are placeholders. Replace them
              with your current store prices before publishing.
            </p>
          </div>
        </main>
      )}
      {tab === "price" && (
        <main>
          <section className="head">
            <label>
              <Pill /> Store Price List
            </label>
            <h2>
              Medicines & <span>Essentials</span>
            </h2>
            <p>Search products and quickly check current store prices.</p>
          </section>
          <div className="search">
            <Search />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search medicine or product..."
            />
          </div>
          <div className="cats">
            {cats.map((c) => (
              <button
                key={c}
                className={cat === c ? "sel" : ""}
                onClick={() => {
                  setCat(c);
                  setPage(1);
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="price-summary">
            <span>
              Showing{" "}
              <strong>
                {list.length === 0 ? 0 : (page - 1) * itemsPerPage + 1}
                {"–"}
                {Math.min(page * itemsPerPage, list.length)}
              </strong>{" "}
              of <strong>{list.length}</strong> products
            </span>

            <span className="page-label">
              Page {page} of {totalPages || 1}
            </span>
          </div>
          <div className="products">
            {paginatedList.map((p) => (
              <div key={p[0]} className="product">
                <div className="picon">
                  <Pill />
                </div>

                <div>
                  <b>{p[0]}</b>
                  <small>
                    {p[1]} · {p[3]}
                  </small>
                </div>

                <strong>₱{p[2].toFixed(2)}</strong>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>

              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;

                  return (
                    <button
                      key={pageNumber}
                      className={`page-number ${
                        page === pageNumber ? "active" : ""
                      }`}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                className="page-btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
          <div className="notice">
            <Info />
            <p>
              Prices and availability may change. Prescription medicines should
              be used according to professional medical advice.
            </p>
          </div>
        </main>
      )}
      {tab === "about" && (
        <main>
          <section className="head">
            <label>
              <HeartPulse /> About Us
            </label>
            <h2>
              Care you can <span>count on.</span>
            </h2>
          </section>
          <div className="about">
            <p>
              Your Pharmacy is a community-focused pharmacy providing medicines,
              wellness products, and everyday health essentials with friendly,
              professional service.
            </p>
            <div>
              <Pill />
              <b>Quality Products</b>
            </div>
            <div>
              <HeartPulse />
              <b>Friendly Service</b>
            </div>
            <div>
              <Clock />
              <b>Convenient Hours</b>
            </div>
          </div>
        </main>
      )}
      {tab === "contact" && (
        <main>
          <section className="head">
            <label>
              <MessageCircle /> Contact
            </label>
            <h2>
              Visit or <span>message us.</span>
            </h2>
          </section>
          <div className="contacts">
            <a href="tel:+639123456789">
              <Phone />
              <span>
                Phone<b>+63 912 345 6789</b>
              </span>
            </a>
            <a href="mailto:yourpharmacy@email.com">
              <Mail />
              <span>
                Email<b>yourpharmacy@email.com</b>
              </span>
            </a>
            <a href="https://m.me/farmacia.mercidita" target="_blank">
              <MessageCircle />
              <span>
                Messenger<b>@farmacia.mercidita</b>
              </span>
            </a>
            <a href="https://maps.google.com" target="_blank">
              <MapPin />
              <span>
                Location<b>Your Pharmacy Address</b>
              </span>
            </a>
            <a
              href="https://www.facebook.com/farmacia.mercidita"
              target="_blank"
            >
              <Facebook />
              <span>
                Facebook<b>facebook.com/farmacia.mercidita</b>
              </span>
            </a>
          </div>
        </main>
      )}
      <nav>
        {[
          ["home", HeartPulse, "Home"],
          ["price", Pill, "Price List"],
          ["about", Info, "About"],
          ["contact", Phone, "Contact"],
        ].map(([id, I, t]) => (
          <button
            key={id}
            className={tab === id ? "active" : ""}
            onClick={() => go(id)}
          >
            <I />
            <span>{t}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
