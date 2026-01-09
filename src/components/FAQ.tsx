import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Apakah akses produknya seumur hidup?",
    answer:
      "Ya! Sekali bayar, kamu bisa akses dan download berkali-kali selamanya (Lifetime Access). Tidak ada biaya langganan atau hidden cost apapun.",
  },
  {
    question: "Bagaimana jika file tidak bisa dibuka?",
    answer:
      "Tim support kami siap bantu 24/7 via WhatsApp. Kami garansi file pasti bekerja. Jika ada masalah teknis, kami akan bantu sampai selesai atau refund 100%.",
  },
  {
    question: "Apakah boleh untuk project komersial?",
    answer:
      "Tentu! Semua aset kami berlisensi Commercial Use untuk project klien kamu. Kamu bebas menggunakannya untuk keperluan bisnis tanpa batasan.",
  },
  {
    question: "Bagaimana cara pembayarannya?",
    answer:
      "Kami menerima berbagai metode pembayaran termasuk QRIS, GoPay, OVO, DANA, ShopeePay, dan transfer bank. Prosesnya cepat dan aman.",
  },
  {
    question: "Apakah ada garansi refund?",
    answer:
      "Ya! Kami memberikan garansi 7 hari. Jika produk tidak sesuai ekspektasi atau ada masalah teknis yang tidak bisa diselesaikan, kami akan refund 100%.",
  },
];

const FAQ = () => {
  return (
    <section className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Pertanyaan <span className="text-gradient">Umum</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Temukan jawaban untuk pertanyaan yang sering diajukan
          </p>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass rounded-2xl border-0 px-6 overflow-hidden animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AccordionTrigger className="text-left py-6 text-foreground font-semibold hover:text-primary hover:no-underline transition-colors [&[data-state=open]]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
