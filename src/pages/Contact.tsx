import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-6 md:px-12">
        <div className="container mx-auto">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-2">Get in Touch</p>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Contact</h1>
            <div className="brand-line w-16 mx-auto mt-4 mb-6" />
            <p className="font-elegant text-lg text-foreground/70">
              Interested in purchasing artwork, commissioning a piece, or collaborating? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <h3 className="font-display text-2xl text-foreground mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <a href="mailto:Info@haqarts.com" className="flex items-start gap-4 group">
                    <Mail size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Email</p>
                      <p className="font-body text-sm text-foreground group-hover:text-primary transition-colors">Info@haqarts.com</p>
                    </div>
                  </a>
                  <a href="tel:+923239341193" className="flex items-start gap-4 group">
                    <Phone size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Phone</p>
                      <p className="font-body text-sm text-foreground group-hover:text-primary transition-colors">0323 9341193</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4">
                    <MapPin size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Location</p>
                      <p className="font-body text-sm text-foreground">Kasur, Pakistan</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-display text-lg text-foreground mb-3">Commission Process</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Share your vision through the form or email. We'll discuss size, medium, subject matter, timeline, and pricing. A 50% advance is required to begin work, with the balance due upon completion.
                </p>
              </div>
            </div>

            {/* Form */}
            <div>
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 border-2 border-primary rounded-full flex items-center justify-center mb-6">
                    <Send size={24} className="text-primary" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground mb-3">Message Sent</h3>
                  <p className="font-body text-sm text-muted-foreground">Thank you for reaching out. We'll get back to you soon.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 font-body text-xs tracking-widest uppercase text-primary hover:text-primary/80 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-secondary/50 border border-border/50 px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-secondary/50 border border-border/50 px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-widest uppercase text-muted-foreground block mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-secondary/50 border border-border/50 px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-primary text-primary-foreground font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
