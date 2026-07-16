import { motion } from 'framer-motion';
import { Star } from '@phosphor-icons/react';

const testimonials = [
  {
    name: 'Carolina M.',
    age: 42,
    text: 'No dormía una noche entera desde hace 3 años. Probaba tés, meditación y nada funcionaba. En la tercera noche del protocolo, dormí 7 horas seguidas. Me desperté llorando de alivio.',
  },
  {
    name: 'Roberto F.',
    age: 55,
    text: 'Despertar a las 3 a.m. era mi rutina. La desesperación de mirar al techo hasta amanecer me destruía. El ejercicio de respiración parasimpática cambió mi vida.',
  },
  {
    name: 'Mariana T.',
    age: 38,
    text: 'Logré dejar las pastillas (con seguimiento médico) usando las técnicas del protocolo. Que la mente se apague de forma natural es la mejor sensación del mundo.',
  },
];

export const SocialProof = () => {
  return (
    <section className="py-32 px-6 relative bg-brand-primary z-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-heading text-brand-secondary mb-6">
              Quiénes ya lograron <br /><span className="text-primary italic">apagar la mente</span>
            </h2>
            <p className="text-brand-secondary/60 font-sans max-w-xl text-lg">
              Miles de personas retomaron el control de sus noches con el Protocolo.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="py-10 border-t border-brand-secondary/10 flex flex-col md:flex-row gap-8 md:gap-16 items-start"
            >
              <div className="md:w-1/3 shrink-0">
                <div className="flex gap-1 mb-4 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} weight="fill" size={16} />
                  ))}
                </div>
                <p className="text-brand-secondary font-medium font-sans text-lg">{testimonial.name}</p>
                <p className="text-brand-secondary/50 text-sm font-sans">{testimonial.age} años</p>
              </div>
              
              <div className="md:w-2/3">
                <p className="text-brand-secondary/90 font-sans text-xl md:text-2xl leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
            </motion.div>
          ))}
          <div className="border-t border-brand-secondary/10"></div>
        </div>
      </div>
    </section>
  );
};
