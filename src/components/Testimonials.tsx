import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dina",
    role: "Content Creator",
    avatar: "D",
    content:
      "Template Notion-nya life changer banget! Jadwal konten jadi rapi. Worth it parah.",
    rating: 5,
  },
  {
    name: "Raka",
    role: "Freelancer",
    avatar: "R",
    content:
      "UI Kit-nya lengkap. Hemat waktu desain sampai 50%. Makasih NFDigitalStore!",
    rating: 5,
  },
  {
    name: "Siti",
    role: "Mahasiswa",
    avatar: "S",
    content:
      "Harganya ramah kantong pelajar tapi kualitasnya premium. Bakal beli lagi sih.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Testimoni
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Kata <span className="text-gradient">Mereka</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ribuan kreator sudah merasakan manfaatnya
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group glass rounded-3xl p-8 relative overflow-hidden animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/20" />

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground text-lg leading-relaxed mb-8">
                "{testimonial.content}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none glow-primary-sm" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
