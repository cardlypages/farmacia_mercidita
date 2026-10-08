import React, { useEffect, useMemo, useState } from "react";
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
import Papa from "papaparse";
import logo from "./public/logo.jpg";
import "./styles.css";

const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwgI-Xz7DS-BX1rUmFPqg0L5Zy9QmU-92VEIoPbSowJlYGf717BV4ViUxvyTfxWmDaYyGgOqWRppAi/pub?output=csv";

const parseCSV = (csv) => {
  const lines = csv
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim());

  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0]
    .split(",")
    .map((header) => header.trim().toLowerCase());

  return lines.slice(1).map((line) => {
    const values = line.split(",");

    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || "";
    });

    return {
      name: row.name,
      category: row.category,
      price: Number(row.price) || 0,
      unit: row.unit,
    };
  });
};

export default function App() {
  const [tab, setTab] = useState("home");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [page, setPage] = useState(1);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");

  const itemsPerPage = 10;

  const cats = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category).filter(Boolean))],
    [products],
  );

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        setProductError("");

        const response = await fetch(GOOGLE_SHEET_URL);

        if (!response.ok) {
          throw new Error("Unable to load product list.");
        }

        const csv = await response.text();

        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,

          complete: (results) => {
            const formattedProducts = results.data
              .map((row) => ({
                name: row.name?.trim() || "",
                category: row.category?.trim() || "",
                price: Number(row.price) || 0,
                unit: row.unit?.trim() || "",
              }))
              .filter((product) => product.name);

            setProducts(formattedProducts);
            setLoadingProducts(false);
          },

          error: () => {
            setProductError("Unable to read product data.");
            setLoadingProducts(false);
          },
        });
      } catch (error) {
        console.error(error);

        setProductError(
          "Unable to load the price list. Please try again later.",
        );

        setLoadingProducts(false);
      }
    };

    loadProducts();

    const interval = setInterval(loadProducts, 30000);

    return () => clearInterval(interval);
  }, []);

  const list = useMemo(
    () =>
      products.filter(
        (p) =>
          (cat === "All" || p.category === cat) &&
          (!q ||
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.category.toLowerCase().includes(q.toLowerCase())),
      ),
    [products, q, cat],
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
              <div key={p.name} className="product">
                <div className="picon">
                  <Pill />
                </div>

                <div>
                  <b>{p.name}</b>
                  <small>
                    {p.category} · {p.unit}
                  </small>
                </div>

                <strong>₱{Number(p.price || 0).toFixed(2)}</strong>
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
