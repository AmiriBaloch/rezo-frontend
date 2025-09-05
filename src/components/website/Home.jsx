"use client";
import React from "react";
import HeroSection from "./home/HeroSection";
import ListingsCarousel from "./home/ListingsCarousel";
import PropertyCarousel from "./home/PropertyCarousel";
import Explore from "./home/Explore";
import RentCarousel from "./home/RentCarousel";
import Companies from "./home/Companies";

function Home() {
  return (
    <div>
      <HeroSection />
      <ListingsCarousel />
      <PropertyCarousel />
      <Explore />
      <RentCarousel />
      <Companies />
    </div>
  );
}

export default Home;
