"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Tracking scroll progress del footer
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Transformar el scroll progress (0-1) a padding (0-20 mobile, 0-100 desktop)
  const paddingX = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isMobile ? 20 : 100]
  );

  return (
    <motion.div
      ref={containerRef}
      className="mx-4 h-screen bg-white"
      style={{ paddingLeft: paddingX, paddingRight: paddingX }}
    >
      <div className="bg-aam-orange h-full rounded-t-4xl overflow-hidden flex flex-col items-start justify-end p-8">
        <p className="text-white w-1/3 mobile:w-3/4 mobile:text-sm mb-10 mobile:mb-6">
          Alalmacén - Tu almacén de barrio con alma gourmet. Donde lo cotidiano
          se encuentra con sabores excepcionales y vinos selectos.
          <br />
          <br />
          <a href="https://maps.app.goo.gl/Am2T6evaLakau9fn8">
            José ingenieros 798, Villa María, Córdoba, Argentina
          </a>
          <br />
          <br />
          <a href="https://www.instagram.com/alalmacen.vm/">Instagram</a>
        </p>
        <Image
          src="/title-02.svg"
          alt="Alalmacén"
          width={1170}
          height={153}
          className="w-full h-auto"
          priority
        />
        <p className="text-white text-sm mobile:text-xs">
          {`© ${new Date().getFullYear()}`}
          <span className="mobile:hidden">
            Alalmacén. Todos los derechos reservados | Diseñado y desarrollado
            por{" "}
          </span>
          <a
            href="https://www.eneasbaroni.com.ar/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-clash-display text-base mobile:text-sm mobile:ml-2"
          >
            Eneas Baroni
          </a>
          .
        </p>
      </div>
    </motion.div>
  );
};
