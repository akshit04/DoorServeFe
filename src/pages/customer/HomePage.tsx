import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { Service } from '../../types/service';
import { Category } from '../../types/category';

// Components
import ServiceCard from '../../components/service/ServiceCard';
import CategoryCard from '../../components/category/CategoryCard';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const HomePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Fetch featured services
    const { data: featuredServices, isLoading: featuredLoading } = useQuery({
        queryKey: ['featuredServices'],
        queryFn: () => api.service.getFeaturedServices(6)
    });

    // Fetch all categories
    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => api.category.getAllCategories()
    });

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?term=${encodeURIComponent(searchTerm)}`);
        }
    };

    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Verified Professionals",
            description: "All service providers are background-checked and verified for your safety and peace of mind."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Flexible Scheduling",
            description: "Book services at your convenience with same-day and next-day availability options."
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Transparent Pricing",
            description: "No hidden fees or surprise charges. See upfront pricing before you book any service."
        }
    ];

    const steps = [
        {
            number: "01",
            title: "Browse & Select",
            description: "Choose from hundreds of professional services in your area",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        {
            number: "02",
            title: "Book Instantly",
            description: "Schedule your service at a time that works best for you",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            number: "03",
            title: "Relax & Enjoy",
            description: "Sit back while our verified professionals take care of everything",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-10V3a1 1 0 011-1h1a1 1 0 011 1v1M5 7a2 2 0 012-2h10a2 2 0 012 2v11a2 2 0 01-2 2H7a2 2 0 01-2-2V7z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Professional Home Services
                            <span className="block text-primary-200">At Your Doorstep</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Connect with trusted professionals for all your home service needs. From cleaning to repairs, we've got you covered.
                        </p>

                        {/* Search Form */}
                        <div className="max-w-2xl mx-auto mb-12">
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 sm:gap-0">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="What service do you need? (e.g., house cleaning, plumbing)"
                                        className="w-full px-6 py-4 text-gray-900 bg-white rounded-lg sm:rounded-r-none border-0 focus:outline-none focus:ring-2 focus:ring-primary-300 text-lg placeholder-gray-500"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-6 sm:hidden">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-4 rounded-lg sm:rounded-l-none font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <span className="hidden sm:inline">Search Services</span>
                                    <span className="sm:hidden">Search</span>
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </Button>
                            </form>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-white mb-2">10,000+</div>
                                <div className="text-primary-200">Happy Customers</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white mb-2">500+</div>
                                <div className="text-primary-200">Verified Professionals</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white mb-2">50+</div>
                                <div className="text-primary-200">Service Categories</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Popular Service Categories
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover the services you need most, from routine maintenance to emergency repairs
                        </p>
                    </div>

                    {categoriesLoading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categories?.slice(0, 8).map((category) => (
                                <CategoryCard key={category.name} category={category} />
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => navigate('/services')}
                        >
                            View All Services
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose DoorServe?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We make it easy to find, book, and manage professional home services
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="text-center" hover>
                                <div className="text-primary-600 mb-6 flex justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Getting professional help for your home has never been easier
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 relative">
                                        <span className="text-primary-600 font-bold text-lg">{step.number}</span>
                                        {index < steps.length - 1 && (
                                            <div className="hidden md:block absolute top-8 left-16 w-24 lg:w-32 h-0.5 bg-gray-200"></div>
                                        )}
                                    </div>
                                    <div className="text-primary-600 mb-4">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Services Section */}
            {featuredServices && featuredServices.length > 0 && (
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Featured Services
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Top-rated services from our most trusted professionals
                            </p>
                        </div>

                        {featuredLoading ? (
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {featuredServices?.slice(0, 6).map((service) => (
                                    <ServiceCard key={service.id} service={service} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-20 bg-primary-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of satisfied customers who trust DoorServe for their home service needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-4"
                            onClick={() => navigate('/search')}
                        >
                            Browse Services
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4"
                            onClick={() => navigate('/register?type=partner')}
                        >
                            Become a Partner
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;