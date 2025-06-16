import React, { useState, useRef } from "react";
import {
  ShieldCheck,
  Target,
  Users,
  Code,
  PenTool,
  BarChart2,
  Menu,
  X,
  ArrowRight,
  Quote,
  User,
} from "lucide-react";

// Componentes pequeños que solo se usan en la Landing Page
const FeatureIcon = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-4 transform transition-all duration-300 hover:scale-105">
    <div className="relative flex items-center justify-center w-16 h-16 mb-4">
      <div className="absolute inset-0 bg-purple-200 rounded-full blur-lg opacity-40"></div>
      <div className="relative bg-white/70 backdrop-blur-sm rounded-full p-4 shadow-md">
        <Icon className="w-8 h-8" style={{ color: "#8E44AD" }} />
      </div>
    </div>
    <h3
      className="text-lg font-semibold"
      style={{ fontFamily: "'Poppins', sans-serif", color: "#2C3E50" }}
    >
      {title}
    </h3>
    <p className="mt-1 text-gray-600 max-w-xs" style={{ color: "#34495E" }}>
      {description}
    </p>
  </div>
);
const ServiceCard = ({ icon: Icon, title, description }) => (
  <div className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 transform-gpu rotate-45 opacity-0 group-hover:opacity-20 transition-all duration-500 group-hover:scale-150 blur-3xl"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-center w-16 h-16 bg-white/80 backdrop-blur-sm rounded-full mb-6 shadow-sm">
        <Icon className="w-8 h-8" style={{ color: "#2C3E50" }} />
      </div>
      <h3
        className="text-xl font-bold mb-3"
        style={{ fontFamily: "'Poppins', sans-serif", color: "#2C3E50" }}
      >
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed" style={{ color: "#34495E" }}>
        {description}
      </p>
    </div>
  </div>
);
const TestimonialCard = ({ text, author, company }) => (
  <div className="bg-white/60 backdrop-blur-xl p-8 rounded-xl shadow-lg flex-shrink-0 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] border border-white/30">
    <Quote className="w-12 h-12 text-purple-200 mb-4" />
    <p
      className="text-gray-700 mb-6 italic leading-relaxed"
      style={{ color: "#34495E" }}
    >
      {text}
    </p>
    <div className="flex items-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl mr-4">
        {author.charAt(0)}
      </div>
      <div>
        <p
          className="font-bold"
          style={{ fontFamily: "'Poppins', sans-serif", color: "#2C3E50" }}
        >
          {author}
        </p>
        <p className="text-gray-500" style={{ color: "#BDC3C7" }}>
          {company}
        </p>
      </div>
    </div>
  </div>
);

export default function LandingPage({ setPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const contactForm = useRef();
  const [statusMessage, setStatusMessage] = useState("");

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
      setIsMenuOpen(false);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setStatusMessage("Enviando...");
    // La lógica de EmailJS iría aquí.
    setTimeout(() => {
      setStatusMessage("¡Mensaje enviado con éxito!");
      if (contactForm.current) contactForm.current.reset();
      setTimeout(() => setStatusMessage(""), 5000);
    }, 1000);
  };

  const navLinks = [
    { href: "#services", label: "Servicios" },
    { href: "#about", label: "Nosotros" },
    { href: "#testimonials", label: "Testimonios" },
    { href: "#contact", label: "Contacto" },
  ];

  return (
    <div
      className="bg-slate-50 font-sans antialiased"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="text-3xl font-bold cursor-pointer"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#2C3E50" }}
          >
            AWOH
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href.substring(1))}
                className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-all"
              style={{ backgroundColor: "#8E44AD" }}
            >
              Hablemos
            </a>
            <button
              onClick={() => setPage("auth")}
              className="flex items-center gap-2 bg-gray-100 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all"
            >
              <User size={20} />
              <span>Iniciar Sesión</span>
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800"
            >
              {isMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm py-4">
            <nav className="flex flex-col items-center space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href.substring(1))}
                  className="text-gray-700 text-lg hover:text-purple-600"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setPage("auth");
                  setIsMenuOpen(false);
                }}
                className="w-full text-center bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700"
                style={{ backgroundColor: "#8E44AD" }}
              >
                Iniciar Sesión
              </button>
            </nav>
          </div>
        )}
      </header>

      <main id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-white -z-20"></div>
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(142,68,173,0.2),rgba(255,255,255,0))]"></div>
          <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(44,62,80,0.1),rgba(255,255,255,0))]"></div>
        </div>
        <div className="container mx-auto px-6 py-24 md:py-32 text-center">
          <h1
            className="text-4xl md:text-6xl font-extrabold"
            style={{
              fontFamily: "'Poppins', sans-serif",
              color: "#2C3E50",
              textShadow: "0px 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            Evolución Continua, <br className="md:hidden" />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-800">
              Resultados Reales.
            </span>
          </h1>
          <p
            className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed"
            style={{ color: "#34495E" }}
          >
            Potenciamos la evolución de tu empresa con consultoría experta y
            software a la medida, transformando tus desafíos en oportunidades de
            crecimiento.
          </p>
          <div className="mt-10 flex justify-center items-center gap-4">
            <a
              href="#services"
              onClick={(e) => handleNavClick(e, "services")}
              className="group bg-gradient-to-r from-purple-600 to-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              Nuestros Servicios{" "}
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </main>

      <section id="about" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <FeatureIcon
              icon={ShieldCheck}
              title="Innovación Constante"
              description="Aplicamos las últimas tecnologías para ofrecer soluciones vanguardistas."
            />
            <FeatureIcon
              icon={Users}
              title="Colaboración Estratégica"
              description="Funcionamos como una extensión de tu equipo para garantizar el éxito."
            />
            <FeatureIcon
              icon={Target}
              title="Enfoque en Resultados"
              description="Medimos nuestro éxito por el impacto tangible en tu negocio."
            />
            <FeatureIcon
              icon={PenTool}
              title="Excelencia y Calidad"
              description="Nos comprometemos con los más altos estándares en cada proyecto."
            />
          </div>
        </div>
      </section>
      <section id="services" className="py-20 bg-slate-50/70">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Poppins', sans-serif", color: "#2C3E50" }}
            >
              Más que software, creamos soluciones
            </h2>
            <p
              className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto"
              style={{ color: "#34495E" }}
            >
              Resolvemos problemas de negocio de raíz, enfocándonos en la
              automatización, centralización de datos y optimización de costos
              para PyMEs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              icon={Code}
              title="Desarrollo a la Medida"
              description="Creamos aplicaciones y sistemas personalizados que se adaptan perfectamente a tus procesos y necesidades específicas."
            />
            <ServiceCard
              icon={BarChart2}
              title="Consultoría Tecnológica"
              description="Te guiamos en la adopción de tecnologías y estrategias que impulsan tu competitividad y eficiencia operativa."
            />
            <ServiceCard
              icon={Users}
              title="Optimización de Procesos"
              description="Analizamos tus flujos de trabajo y los automatizamos para liberar el potencial de tu equipo y reducir costos."
            />
          </div>
        </div>
      </section>
      <section
        id="testimonials"
        className="py-20 bg-gradient-to-br from-gray-50 to-purple-50"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Poppins', sans-serif", color: "#2C3E50" }}
            >
              Tu crecimiento es nuestro objetivo
            </h2>
            <p
              className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto"
              style={{ color: "#34495E" }}
            >
              Nos enorgullece construir relaciones a largo plazo basadas en la
              confianza y los resultados.
            </p>
          </div>
          <div className="flex overflow-x-auto space-x-8 pb-8 -mx-6 px-6 snap-x snap-mandatory">
            <TestimonialCard
              text="AWOH transformó nuestra operación."
              author="Ana García"
              company="Gerente en Logística Local"
            />
            <TestimonialCard
              text="El equipo de AWOH no solo entrega código."
              author="Carlos Rodriguez"
              company="Dueño de E-commerce"
            />
            <TestimonialCard
              text="Su enfoque en la optimización nos ayudó."
              author="Laura Martinez"
              company="Directora de Servicios Profesionales"
            />
          </div>
        </div>
      </section>
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Poppins', sans-serif", color: "#2C3E50" }}
            >
              ¿Listo para impulsar tu negocio?
            </h2>
            <p
              className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto"
              style={{ color: "#34495E" }}
            >
              Hablemos de tus desafíos y de cómo podemos ayudarte.
            </p>
          </div>
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-2xl border border-gray-100">
            <form ref={contactForm} onSubmit={handleContactSubmit}>
              <div className="flex flex-col space-y-6">
                <div>
                  <label
                    htmlFor="user_name_contact"
                    className="font-semibold mb-2 block"
                    style={{ color: "#34495E" }}
                  >
                    {" "}
                    Nombre{" "}
                  </label>
                  <input
                    type="text"
                    id="user_name_contact"
                    name="user_name"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="user_email_contact"
                    className="font-semibold mb-2 block"
                    style={{ color: "#34495E" }}
                  >
                    {" "}
                    Correo Electrónico{" "}
                  </label>
                  <input
                    type="email"
                    id="user_email_contact"
                    name="user_email"
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message_contact"
                    className="font-semibold mb-2 block"
                    style={{ color: "#34495E" }}
                  >
                    {" "}
                    ¿Cómo podemos ayudarte?{" "}
                  </label>
                  <textarea
                    id="message_contact"
                    name="message"
                    required
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
                  ></textarea>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-purple-600 text-white font-bold py-4 px-10 rounded-lg hover:bg-purple-700"
                    style={{ backgroundColor: "#8E44AD" }}
                  >
                    Enviar Mensaje
                  </button>
                </div>
                {statusMessage && (
                  <p className="text-center text-gray-700 mt-4">
                    {statusMessage}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer
        className="bg-gray-800 text-white"
        style={{ backgroundColor: "#2C3E50" }}
      >
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-6 md:mb-0">
              <p
                className="text-3xl font-bold"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {" "}
                AWOH{" "}
              </p>
              <p className="text-gray-400 mt-1">
                {" "}
                Innovación que impulsa tu negocio.{" "}
              </p>
            </div>
            <div className="flex space-x-8">
              <a
                href="#services"
                onClick={(e) => handleNavClick(e, "services")}
                className="hover:text-purple-400 transition-colors"
              >
                {" "}
                Servicios{" "}
              </a>
              <a
                href="#about"
                onClick={(e) => handleNavClick(e, "about")}
                className="hover:text-purple-400 transition-colors"
              >
                {" "}
                Nosotros{" "}
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="hover:text-purple-400 transition-colors"
              >
                {" "}
                Contacto{" "}
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500">
            &copy; {new Date().getFullYear()} AWOH. Todos los derechos
            reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
