"use client";
import { useState } from "react";
import { FaPhone, FaEnvelope, FaArrowRight, FaHome } from "react-icons/fa";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import Link from "next/link";

const socialLinks = [
  {
    Icon: FaFacebookF,
    url: "https://www.facebook.com/yourpage",
    label: "Facebook",
  },
  {
    Icon: FaTwitter,
    url: "https://twitter.com/yourprofile",
    label: "Twitter",
  },
  {
    Icon: FaLinkedinIn,
    url: "https://www.linkedin.com/in/yourprofile",
    label: "LinkedIn",
  },
  {
    Icon: FaInstagram,
    url: "https://www.instagram.com/yourprofile",
    label: "Instagram",
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && agreed) {
      alert(`Thank you for subscribing with ${email}`);
      setEmail("");
      setAgreed(false);
    }
  };

  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4">
        {/* Upper Cards */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-6 py-10 px-2">
          {/* Left Card */}
          <div className="relative w-full max-w-md">
            <div className="bg-primary rounded-xl p-4 md:p-6 flex items-center gap-4 w-full relative">
              <img
                src="bg.jpg"
                alt="User"
                className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-lg md:text-xl font-bold">
                  You need a house
                </h2>
                <p className="text-xs md:text-[10px] py-1">
                  Tell us your needs, we will give you thousands of suggestions
                  for the dream home.
                </p>
              </div>
            </div>
            <button className="bg-hoversecondary text-white px-4 py-1 md:px-6 md:py-1.5 rounded-lg flex items-center gap-2 absolute -bottom-3 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs md:text-sm">
              <FaPhone /> Contact Host
            </button>
          </div>

          {/* Right Card */}
          <div className="relative w-full max-w-md mt-10 lg:mt-0">
            <div className="bg-primary rounded-xl p-4 md:p-6 flex items-center gap-4 w-full relative">
              <img
                src="bg.jpg"
                alt="User"
                className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-lg md:text-xl font-bold">
                  You need a house
                </h2>
                <p className="text-xs md:text-[10px] py-1">
                  Tell us your needs, we will give you thousands of suggestions
                  for the dream home.
                </p>
              </div>
            </div>
            <button className="bg-hoversecondary text-white px-4 py-1 md:px-6 md:py-1.5 rounded-lg flex items-center gap-2 absolute -bottom-3 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs md:text-sm">
              <FaHome /> Rent Property
            </button>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          {/* Footer Main Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
            {/* Office Address */}
            <div className="px-2">
              <h4 className="text-sm font-semibold mb-4">Office Address</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 font-semibold">
                    Head office:
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    Behria Town Phase 8, Islamabad, Pakistan
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold">Branch:</p>
                  <p className="text-xs text-gray-300 mt-1">
                    Main Super Market Madina Chowk Depalpur
                  </p>
                </div>
                <p className="text-xs text-gray-300 pt-3 border-t border-gray-600">
                  Dubai
                </p>
              </div>
            </div>

            {/* Contact Seller */}
            <div className="px-2">
              <h4 className="text-sm font-semibold mb-4">Contact Seller</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-700 rounded-full flex-shrink-0">
                    <img
                      src="bg.jpg"
                      alt="User"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Mr. Tariq Zia</p>
                    <p className="text-sm text-gray-300">(+92) 3347777547</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 border-y border-gray-600 py-3">
                  <FaPhone className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Landline:</p>
                    <p className="text-sm text-gray-300">(+92) 3347777547</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Email:</p>
                    <p className="text-sm text-gray-300">info@rezo.com.pk</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Company */}
            <div className="px-2">
              <h4 className="text-sm font-semibold mb-4">Our Company</h4>
              <ul className="space-y-3">
                {[
                  { label: "Property", link: "/property" },
                  { label: "About Us", link: "/about" },
                  { label: "Our Agents", link: "/agents" },
                  { label: "Terms Of Use", link: "/terms" },
                  { label: "Privacy Policy", link: "/privacy" },
                  { label: "Contact Us", link: "/contact" },
                ].map(({ label, link }) => (
                  <li key={label} className="flex items-center gap-2">
                    <FaArrowRight className="text-xs text-gray-400" />
                    <Link
                      href={link}
                      className="text-xs text-gray-400 hover:text-white transition"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="px-2">
              <h4 className="text-sm font-semibold mb-4">Newsletter</h4>
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-xs text-gray-300">
                  Sign up to receive the latest articles
                </p>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full p-2 px-4 rounded text-sm text-primary border border-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-primary px-4 py-2 rounded flex items-center justify-center gap-2 text-sm hover:bg-opacity-90 transition"
                >
                  Sign Up <FaArrowRight className="hover:scale-110" />
                </button>
                <div className="flex items-end gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-gray-400 cursor-pointer"
                  >
                    I have read and agree to the terms & conditions
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-b border-gray-700 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between px-4 gap-4 py-4">
            <Link href="/">
              <img src="/Logo/logo.png" alt="Logo" className="w-12" />
            </Link>
            <ul className="flex items-center gap-4 md:gap-6 order-1 md:order-none">
              {[
                { name: "Home", path: "/" },
                { name: "Property", path: "/property" },
                { name: "Contact", path: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-sm hover:text-primary text-gray-700 cursor-pointer transition"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-4">
              {socialLinks.map(({ Icon, url, label }, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-primary flex items-center justify-center hover:bg-primary hover:border-primary transition"
                  aria-label={label}
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-4 text-center">
          <p className="text-xs text-gray-400">
            Copyright © 2025. Designed & Developed by{" "}
            <a
              href="https://www.nano.com.pk/"
              className="text-primary hover:underline font-bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              NANO Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
