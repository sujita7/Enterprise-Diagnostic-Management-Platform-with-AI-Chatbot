import React from 'react';
import logoAgilus from "../../assets/icons/logo_agilus.svg";
import playstore from "../../assets/icons/play_store.svg";
import appstore from "../../assets/icons/apple_store.svg";

// ✅ Added custom social icons
import facebookIcon from "../../assets/icons/facebook.svg";
import twitterIcon from "../../assets/icons/twitter.svg";
import instagramIcon from "../../assets/icons/instagram.svg";
import linkedinIcon from "../../assets/icons/linkedin.svg";
import youtubeIcon from "../../assets/icons/youtube.svg";

import { Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-white text-black">
      <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center gap-10">
                <a href="/">
                  <img
                    src={logoAgilus}
                    alt="Agilus Diagnostics"
                    className="h-12 w-auto"
                  />
                </a>
              </div>
              {/* <span className="text-xl font-semibold text-black">Agilus Diagnostics</span> */}
            </div>
            <p className="text-black leading-relaxed mb-6">
              India's leading diagnostic network with 29+ years of excellence.
              Trusted by millions for accurate, reliable, and accessible
              healthcare.
            </p>

            <div className="flex gap-3 mb-6">
              <button className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center">
                <img
                  src={facebookIcon}
                  alt="Facebook"
                  className="w-5 h-5 object-contain"
                />
              </button>
              <button className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center">
                <img
                  src={twitterIcon}
                  alt="Twitter"
                  className="w-5 h-5 object-contain"
                />
              </button>
              <button className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center">
                <img
                  src={instagramIcon}
                  alt="Instagram"
                  className="w-5 h-5 object-contain"
                />
              </button>
              <button className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center">
                <img
                  src={linkedinIcon}
                  alt="LinkedIn"
                  className="w-5 h-5 object-contain"
                />
              </button>
              <button className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center">
                <img
                  src={youtubeIcon}
                  alt="YouTube"
                  className="w-5 h-5 object-contain"
                />
              </button>
            </div>

            {/* ✅ Added Store Buttons */}
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium text-gray-700 whitespace-nowrap">
                Get App
              </span>
              <div className="flex gap-4">
                <a
                  href="https://play.google.com/store/apps/details?id=com.srllimited.srl&hl=en_IN"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={playstore}
                    alt="Play Store"
                    className="h-10 cursor-pointer"
                  />
                </a>

                <a
                  href="https://apps.apple.com/my/app/agilus-diagnostics-blood-test/id840710041"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={appstore}
                    alt="App Store"
                    className="h-10 cursor-pointer"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-black font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/tests"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("/tests");
                  }}
                  className="hover:text-[#0076BC] active:text-[#0076BC] transition-colors"
                >
                  Book Test
                </a>
              </li>
              <li>
                <a
                  href="/packages"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("/packages");
                  }}
                  className="hover:text-[#0076BC] active:text-[#0076BC] transition-colors"
                >
                  Health Packages
                </a>
              </li>
              <li>
                <a
                  href="/404"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("/404");
                  }}
                  className="hover:text-[#0076BC] active:text-[#0076BC] transition-colors"
                >
                  Upload Prescription
                </a>
              </li>
              <li>
                <a
                  href="/404"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("/404");
                  }}
                  className="hover:text-[#0076BC] active:text-[#0076BC] transition-colors"
                >
                  View Reports
                </a>
              </li>
              <li>
                <a
                  href="/404"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("/404");
                  }}
                  className="hover:text-[#0076BC] active:text-[#0076BC] transition-colors"
                >
                  Find Labs
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-black font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/404"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("/404");
                  }}
                  className="hover:text-[#0076BC] active:text-[#0076BC] transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/404"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("/404");
                  }}
                  className="hover:text-[#0076BC] active:text-[#0076BC] transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="/404"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("/404");
                  }}
                  className="hover:text-[#0076BC] active:text-[#0076BC] transition-colors"
                >
                  Press
                </a>
              </li>
              <li>
                <a
                  href="/404"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("/404");
                  }}
                  className="hover:text-[#0076BC] active:text-[#0076BC] transition-colors"
                >
                  Partners
                </a>
              </li>
              <li>
                <a
                  href="/404"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("/404");
                  }}
                  className="hover:text-[#0076BC] active:text-[#0076BC] transition-colors"
                >
                  Accreditations
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-black font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/404"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("/404");
                  }}
                  className="hover:text-[#0076BC] active:text-[#0076BC] transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/404"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("/404");
                  }}
                  className="hover:text-[#0076BC] active:text-[#0076BC] transition-colors"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="/404"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("/404");
                  }}
                  className="hover:text-[#0076BC] active:text-[#0076BC] transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/404"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("/404");
                  }}
                  className="hover:text-[#0076BC] active:text-[#0076BC] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/404"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("/404");
                  }}
                  className="hover:text-[#0076BC] active:text-[#0076BC] transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact info */}
        <div className="border-t border-gray-300 pt-8 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                <Phone className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Call us</div>
                <div className="text-black font-medium">1800-123-4567</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                <Mail className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Email us</div>
                <div className="text-black font-medium">support@agilus.com</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Head office</div>
                <div className="text-black font-medium">Gurugram, Haryana, India</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom (FULL WIDTH FIXED) */}
      <div className="bg-[#071D37] w-full py-4">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 text-center md:text-left">
          <p className="text-white text-sm">
            © 2026 Agilus Diagnostics. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm">
            <a
              href="/404"
              className="text-white hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/404"
              className="text-white hover:text-gray-300 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/404"
              className="text-white hover:text-gray-300 transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}