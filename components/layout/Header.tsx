"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import SignUpModal from "@/components/auth/SignUpModal";
import SignInModal from "@/components/auth/SignInModal";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "glassmorphism shadow-lg border-b border-border/40"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-10">
            <span className="text-3xl font-display font-bold text-primary">
              Rambo
            </span>
          </Link>

          {/* Navigation - Center */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/rent"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors relative group"
            >
              Rent
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/buy"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors relative group"
            >
              Buy
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Auth - Right */}
          <div className="flex items-center space-x-4 z-10">
            <button
              onClick={() => setIsSignInOpen(true)}
              className="text-sm font-medium text-foreground hover:text-accent transition-colors hidden sm:block"
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUpOpen(true)}
              className="px-6 py-2.5 text-sm font-semibold text-primary bg-accent hover:bg-accent/90 rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 z-10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-foreground"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-border/40 glassmorphism">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-base font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/rent"
                className="text-base font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Rent
              </Link>
              <Link
                href="/buy"
                className="text-base font-medium text-foreground hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Buy
              </Link>
              <div className="pt-4 border-t border-border/40 space-y-3">
                <button
                  onClick={() => {
                    setIsSignInOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-base font-medium text-foreground hover:text-accent transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsSignUpOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-center text-primary bg-accent hover:bg-accent/90 rounded-md transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </header>
  );
}
