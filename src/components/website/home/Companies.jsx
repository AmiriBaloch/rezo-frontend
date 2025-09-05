import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Companies() {
    const companies = [
        {
            id: 1,
            name: "Princess Apartment Building",
            image: "bg.jpg",
        },
        {
            id: 2,
            name: "Rose Rayhaan Building",
            image: "bg.jpg",
        },
        {
            id: 3,
            name: "JW Marriott Marqui Building",
            image: "bg.jpg",
        },
        {
            id: 4,
            name: "Princess Apartment Building",
            image: "bg.jpg",
        },
        {
            id: 5,
            name: "Rose Rayhaan Building",
            image: "bg.jpg",
        },
        {
            id: 6,
            name: "JW Marriott Marqui Building",
            image: "bg.jpg",
        },
    ];

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                }
            }
        ]
    };

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h1 className='text-center text-2xl md:text-3xl font-bold mb-8 text-gray-800'>
                    Trusted by over 150+ major companies
                </h1>

                <div className="px-4">
                    <Slider {...settings}>
                        {companies.map(company => (
                            <div key={company.id} className="px-2 focus:outline-none">
                                <div className="flex items-center justify-center h-full px-2 py-4">
                                    <img
                                        src={company.image}
                                        alt={company.name}
                                        className='h-16 w-auto max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300'
                                    />
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
}

export default Companies;