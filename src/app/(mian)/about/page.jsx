import React from "react";
import Image from "next/image";

const page = () => {
  return (
    <div className="bg-gray-100 text-secondary font-secondary ">
      <section className="max-w-7xl mx-auto text-center ">
        <div className="flex justify-between items-center py-10"> 
          <span>
            <h2 className="text-3xl font-semibold text-secondary font-primary mb-4">
              Empowering Property Owners
            </h2>
            <h1 className="text-4xl font-bold text-primary mb-6">
              Simplifying Real Estate
            </h1>
          </span>
          <span>
            <p className="text-secondary max-w-xl mx-auto">
              Welcome to Rezo, your trusted digital marketplace for real estate.
              We connect property owners, buyers, and renters through a
              seamless, secure, and user-friendly platform designed for the
              modern market.
            </p>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          <Image
            src="/bg.jpg"
            alt="Building"
            width={300}
            height={300}
            className="rounded-xl"
          />
          <Image
            src="/bg.jpg"
            alt="Building"
            width={300}
            height={300}
            className="rounded-xl"
          />
          <Image
            src="/bg.jpg"
            alt="Building"
            width={300}
            height={300}
            className="rounded-xl"
          />
        </div>
      </section>
        <section className="max-w-7xl mx-auto text-center py-10">
            <h2 className="text-3xl font-semibold text-secondary font-primary mb-4">
            Our Mission
            </h2>
            <p className="text-secondary max-w-xl mx-auto">
            At Rezo, we aim to revolutionize the real estate experience by
            providing a platform that is not only efficient but also transparent
            and secure. We believe in empowering property owners and making the
            process of buying, selling, or renting as straightforward as possible.
            </p>
        </section>
        <section className="max-w-7xl mx-auto text-center py-10">
            <h2 className="text-3xl font-semibold text-secondary font-primary mb-4">
            Our Vision
            </h2>
            <p className="text-secondary max-w-xl mx-auto">
            We envision a world where real estate transactions are seamless,
            transparent, and accessible to everyone. Our goal is to be the go-to
            platform for all your real estate needs, whether you're a property
            owner, buyer, or renter.
            </p>
        </section>
        <section className="max-w-7xl mx-auto text-center py-10">
            <h2 className="text-3xl font-semibold text-secondary font-primary mb-4">
            Our Values
            </h2>
            <p className="text-secondary max-w-xl mx-auto">
            Integrity, transparency, and customer satisfaction are at the core of
            everything we do. We are committed to providing a platform that you
            can trust and rely on for all your real estate needs.
            </p>
        </section>
        <section className="max-w-7xl mx-auto text-center py-10">
            <h2 className="text-3xl font-semibold text-secondary font-primary mb-4">
            Join Us
            </h2>
            <p className="text-secondary max-w-xl mx-auto">
            Whether you're looking to buy, sell, or rent, Rezo is here to help.
            Join us today and experience the future of real estate.
            </p>
        </section>
      <section className="max-w-7xl mx-auto text-center py-10">
        <h2 className="text-3xl font-semibold text-secondary font-primary mb-4">
          Get Started
        </h2>
        <p className="text-secondary max-w-xl mx-auto">
          Ready to take the next step? Sign up now and start your journey with
          Rezo.
        </p>
        <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition duration-300">
          Sign Up
        </button>
        </section>
       
    </div>
  );
};

export default page;
