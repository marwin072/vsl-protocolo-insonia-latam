import { motion } from 'framer-motion';
import { Accordion } from '../ui/Accordion';

const faqItems = [
  {
    title: '¿Y si no me gusta o no funciona para mí?',
    content: 'Tienes 7 días de garantía incondicional. Si aplicas el método y no sientes ninguna mejora en la calidad de tu sueño, o simplemente no te gusta el material, basta con enviar un solo correo a nuestro soporte y te devolveremos el 100% de tu dinero, sin preguntas.',
  },
  {
    title: '¿Necesito comprar algún equipo o pastilla?',
    content: 'No. El Protocolo Mente Apagada se basa en ajustes de comportamiento, técnicas de respiración y regulación de luz (higiene del sueño avanzada). No necesitarás gastar en suplementos o equipos caros.',
  },
  {
    title: '¿Cuánto tiempo toma ver resultados?',
    content: 'Muchos alumnos reportan una mejora significativa desde la primera noche aplicando la Fase 1 y 2 del protocolo. Sin embargo, para regular totalmente tu ciclo circadiano, recomendamos la aplicación continua por al menos 7 a 14 días.',
  },
  {
    title: 'Tomo pastillas para dormir desde hace años. ¿El protocolo me sirve?',
    content: 'Sí. Las técnicas enseñadas ayudan a señalizarle a tu cerebro que es hora de dormir de forma natural. Atención: nunca dejes de tomar tus medicamentos abruptamente sin consultar a tu médico. El protocolo puede usarse en paralelo para ayudar en el proceso de dejarlos de forma orientada.',
  },
  {
    title: '¿Cómo recibiré el acceso?',
    content: 'En cuanto se apruebe el pago, recibirás un correo electrónico con tu usuario y contraseña para acceder a la zona de miembros exclusiva y ver/leer todo el contenido inmediatamente.',
  },
];

export const FAQ = () => {
  return (
    <section className="py-32 px-6 bg-brand-primary relative z-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-heading text-brand-secondary mb-4"
          >
            Preguntas <span className="text-primary italic">Frecuentes</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Accordion items={faqItems} />
        </motion.div>
      </div>
    </section>
  );
};
