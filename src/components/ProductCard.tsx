import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  featured?: boolean;
  price?: number | null;
}

const ProductCard = ({ id, name, category, description, image, featured = false, price }: ProductCardProps) => {
  return (
    <Link 
      to={`/produk/${id}`}
      className={`group relative bg-card rounded-2xl overflow-hidden border border-border card-hover flex flex-col cursor-pointer ${
        featured ? "row-span-2" : ""
      }`}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden ${featured ? "h-72" : "h-56"}`}>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        


        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-background/90 text-foreground px-4 py-2 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Lihat Detail
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
        {price && Number(price) > 0 ? (
          <div className="text-sm font-extrabold text-blue-600 mt-4">
            Rp {Number(price).toLocaleString("id-ID")}
          </div>
        ) : (
          <div className="text-sm font-extrabold text-blue-600 mt-4 h-5">
            &nbsp;
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
