import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function FAQPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Are your products 100% natural?",
      answer: "Yes, all our products are made with 100% natural and herbal ingredients. We source the finest botanical extracts and essential oils to create our luxury skincare solutions."
    },
    {
      question: "How long does shipping take?",
      answer: "We offer free shipping on orders above ₹999. Standard delivery takes 3-5 business days, while express delivery takes 1-2 business days with additional charges."
    },
    {
      question: "Can I return products if I'm not satisfied?",
      answer: "Yes, we offer a 30-day return policy. If you're not completely satisfied with your purchase, you can return the unused product for a full refund."
    },
    {
      question: "Are your products suitable for sensitive skin?",
      answer: "Our products are dermatologically tested and suitable for all skin types, including sensitive skin. However, we recommend doing a patch test before first use."
    },
    {
      question: "How should I store the products?",
      answer: "Store our products in a cool, dry place away from direct sunlight. Some products may require refrigeration - please check individual product instructions."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we only ship within India. We're working on expanding our shipping to international locations soon."
    }
  ];

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">Find answers to common questions about our products and services</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                <div className={`transform transition-transform ${openIndex === index ? 'rotate-45' : ''}`}>
                  <Plus className="w-5 h-5 text-rose-500" />
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">Our customer support team is here to help you</p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}