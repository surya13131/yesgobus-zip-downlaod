"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/navbar";
import Footer from "../components/footer/page";
import "./travel.css";

function TravelQueryContent() {
  const searchParams = useSearchParams();
  const destinationFromURL = searchParams.get("destination") || "";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    area: "",
    pin: "",
    destination: destinationFromURL,
    budget: "",
    date: "",
    travelers: ""
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      {/* Mobile Responsive Overrides injected here to ensure external CSS isn't broken */}
      <style>{`
        @media (max-width: 992px) {
          .travel-card {
            width: 92% !important;
            padding: 24px 16px !important;
            margin: 20px auto !important;
            box-sizing: border-box !important;
          }
          .form-grid {
            display: grid !important;
            grid-template-columns: 1fr !important; /* Stacks everything into 1 column */
            gap: 16px !important;
          }
          .travel-input {
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .travel-input.full {
            grid-column: 1 / -1 !important; /* Resets full-width span on mobile */
          }
          .phone-row {
            width: 100% !important;
            display: flex !important;
            box-sizing: border-box !important;
          }
          .phone-prefix {
            flex-shrink: 0 !important;
          }
          .phone-row .travel-input {
            flex-grow: 1 !important;
            width: auto !important;
          }
          .submit-wrapper {
            margin-top: 20px !important;
            width: 100% !important;
          }
          .submit-btn {
            width: 100% !important; /* Makes button full width for easy tapping */
          }
        }
      `}</style>

      <main className="large-screen-container">
        <div className="page-container">
          <div className="travel-card">
            <h2 className="travel-title">
              Travel Query Form
            </h2>

            <div className="form-grid">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="travel-input"
                onChange={handleChange}
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="travel-input"
                onChange={handleChange}
              />

              {/* PHONE */}
              <div className="phone-row">
                <div className="phone-prefix">
                  +91
                </div>

                <input
                  type="tel"
                  name="phone"
                  placeholder="9999999999"
                  className="travel-input"
                  onChange={handleChange}
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Your Email Address"
                className="travel-input full"
                onChange={handleChange}
              />

              <input
                type="text"
                name="area"
                placeholder="Area"
                className="travel-input"
                onChange={handleChange}
              />

              <input
                type="number"
                name="pin"
                placeholder="Postal Pin Code"
                className="travel-input"
                onChange={handleChange}
              />

              {/* DESTINATION AUTO FILLED */}
              <input
                type="text"
                name="destination"
                value={form.destination}
                placeholder="Destination of interest"
                className="travel-input"
                onChange={handleChange}
              />

              <input
                type="number"
                name="budget"
                placeholder="Budget in INR"
                className="travel-input"
                onChange={handleChange}
              />

              <input
                type="date"
                name="date"
                className="travel-input"
                onChange={handleChange}
              />

              <input
                type="number"
                name="travelers"
                placeholder="Number of travelers"
                className="travel-input"
                onChange={handleChange}
              />
            </div>

            <div className="submit-wrapper">
              <button className="submit-btn">
                Submit
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function TravelQueryForm() {
  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* SUSPENSE BOUNDARY REQUIRED BY NEXT.JS FOR useSearchParams */}
      <Suspense fallback={<div className="text-center py-5" style={{ minHeight: '60vh' }}>Loading...</div>}>
        <TravelQueryContent />
      </Suspense>

      {/* FOOTER */}
      <Footer />
    </>
  );
}