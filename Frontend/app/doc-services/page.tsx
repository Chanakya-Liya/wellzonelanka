"use client";

import {
  Activity,
  Brain,
  Dumbbell,
  Spline as Spine,
  FileWarning as Running,
  Baby,
  Armchair as Wheelchair,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/doc-navbar";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChatDialog } from "@/components/chatbot/ChatDialog";
import { ChatButton } from "@/components/chatbot/ChatButton";
import Sidebar from "@/app/Sidebar";
import { Footer } from "../Footer";

export default function ServicesPage() {
  const services = [
    {
      icon: <Spine className="h-12 w-12 text-black" />,
      title: "Orthopedic Physiotherapy",
      description:
        "Expert treatment for musculoskeletal conditions, joint pain, and post-surgical rehabilitation.",
      features: [
        "Joint and muscle pain treatment",
        "Post-surgery rehabilitation",
        "Sports injury recovery",
        "Spine care programs",
      ],
    },
    {
      icon: <Brain className="h-12 w-12 text-black" />,
      title: "Neurological Rehabilitation",
      description:
        "Specialized care for neurological conditions and movement disorders.",
      features: [
        "Stroke rehabilitation",
        "Balance disorder treatment",
        "Movement therapy",
        "Cognitive rehabilitation",
      ],
    },
    {
      icon: <Running className="h-12 w-12 text-black" />,
      title: "Sports Physiotherapy",
      description: "Comprehensive care for athletes and sports enthusiasts.",
      features: [
        "Sports injury treatment",
        "Performance enhancement",
        "Injury prevention",
        "Return to sport programs",
      ],
    },
    {
      icon: <Baby className="h-12 w-12 text-black" />,
      title: "Pediatric Physiotherapy",
      description: "Specialized physical therapy for children and adolescents.",
      features: [
        "Developmental assessment",
        "Motor skills development",
        "Posture correction",
        "Pediatric rehabilitation",
      ],
    },
    {
      icon: <Wheelchair className="h-12 w-12 text-black" />,
      title: "Geriatric Physiotherapy",
      description:
        "Tailored care for elderly patients focusing on mobility and independence.",
      features: [
        "Balance training",
        "Fall prevention",
        "Mobility enhancement",
        "Pain management",
      ],
    },
    {
      icon: <Dumbbell className="h-12 w-12 text-black" />,
      title: "Exercise Therapy",
      description:
        "Customized exercise programs for various conditions and fitness goals.",
      features: [
        "Therapeutic exercises",
        "Strength training",
        "Flexibility programs",
        "Core stabilization",
      ],
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      scale: 1.03,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  const processStepVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Sidebar />
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 px-4 bg-gradient-to-b from-primary/5 to-white"
      >
        <div className="max-w-7xl mx-auto text-center pt-11">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 pt-11 text-black"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-black max-w-2xl mx-auto"
          >
            Comprehensive physiotherapy and wellness services tailored to your
            needs
          </motion.p>
        </div>
      </motion.section>

      {/* Services Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 transition-shadow"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div className="mb-6" variants={iconVariants}>
                  {service.icon}
                </motion.div>
                <motion.h3
                  className="text-2xl font-semibold mb-4 text-black"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {service.title}
                </motion.h3>
                <motion.p
                  className="text-black mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {service.description}
                </motion.p>
                <motion.ul
                  className="space-y-3 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {service.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-center text-sm text-black"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                    >
                      <Activity className="h-4 w-4 text-black mr-2" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <Link
                    href="/doctors-names"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-semibold"
                  >
                    Book Service
                    <ArrowRight className="ml-2 h-4 w-4 text-blue-600" />
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Treatment Process */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 text-black"
          >
            Our Treatment Process
          </motion.h2>
          <motion.div
            className="grid md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
          >
            {[
              {
                number: "01",
                title: "Initial Assessment",
                description:
                  "Comprehensive evaluation of your condition and medical history",
              },
              {
                number: "02",
                title: "Treatment Plan",
                description:
                  "Customized therapy program tailored to your specific needs",
              },
              {
                number: "03",
                title: "Regular Sessions",
                description:
                  "Structured therapy sessions with continuous progress monitoring",
              },
              {
                number: "04",
                title: "Recovery & Prevention",
                description: "Long-term recovery plan with preventive measures",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center bg-white p-6 rounded-lg shadow-sm"
                variants={processStepVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="text-4xl font-bold text-primary mb-4"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  viewport={{ once: true }}
                >
                  {step.number}
                </motion.div>
                <motion.h3
                  className="text-xl font-semibold mb-2 text-black"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.2 }}
                  viewport={{ once: true }}
                >
                  {step.title}
                </motion.h3>
                <motion.p
                  className="text-black"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.2 }}
                  viewport={{ once: true }}
                >
                  {step.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* CTA Section */}
      <motion.section
        className="py-16 px-4 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            className="bg-primary text-white rounded-lg p-8"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.02,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
              },
            }}
          >
          </motion.div>
        </div>
      </motion.section>

      {/* Chatbot Icon */}
      <ChatButton onClick={() => setChatOpen(true)} />
      <ChatDialog open={chatOpen} onOpenChange={setChatOpen} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
