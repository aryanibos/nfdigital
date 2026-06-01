import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <ProductGrid />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <Features />
      <Footer />
    </Layout>
  );
};

export default Index;
