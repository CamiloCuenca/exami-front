import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Home = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simular carga de datos
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    const slides = [
        {
            title: "Plataforma de Evaluación Inteligente",
            description: "Crea y gestiona exámenes en línea de manera eficiente",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
        },
        {
            title: "Banco de Preguntas",
            description: "Accede a un extenso banco de preguntas por temas",
            image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80"
        },
        {
            title: "Estadísticas Detalladas",
            description: "Analiza el rendimiento de tus estudiantes con gráficos interactivos",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
        }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
            <Navbar />
            
            {/* Carrusel Principal */}
            <section className="relative h-[600px]">
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    className="h-full"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative h-full">
                                <div className="absolute inset-0 bg-black opacity-50"></div>
                                <img 
                                    src={slide.image} 
                                    alt={slide.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-white px-4">
                                        <motion.h2 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="text-4xl md:text-6xl font-bold mb-4"
                                        >
                                            {slide.title}
                                        </motion.h2>
                                        <motion.p 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                            className="text-xl md:text-2xl mb-8"
                                        >
                                            {slide.description}
                                        </motion.p>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                        >
                                            <Link 
                                                to="/login"
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
                                            >
                                                Comenzar Ahora
                                            </Link>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* Características Principales */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center text-indigo-800 mb-12">
                        Características Principales
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Creación de Exámenes",
                                description: "Crea exámenes personalizados con diferentes tipos de preguntas y configuraciones.",
                                icon: "📝"
                            },
                            {
                                title: "Banco de Preguntas",
                                description: "Accede a un extenso banco de preguntas por temas y niveles de dificultad.",
                                icon: "📚"
                            },
                            {
                                title: "Estadísticas Detalladas",
                                description: "Analiza el rendimiento de tus estudiantes con gráficos interactivos.",
                                icon: "📊"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-indigo-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-indigo-600 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">
                        ¿Listo para comenzar?
                    </h2>
                    <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                        Únete a nuestra plataforma y transforma la manera en que evalúas a tus estudiantes.
                    </p>
                    <Link 
                        to="/login"
                        className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 inline-block"
                    >
                        Iniciar Sesión
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;