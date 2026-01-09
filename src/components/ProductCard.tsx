import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  featured?: boolean;
}

const ProductCard = ({ name, category, price, description, image, featured = false }: ProductCardProps) => {
  return (
    <div 
      className={`group relative bg-card rounded-2xl overflow-hidden border border-border card-hover ${
        featured ? "row-span-2" : ""
      }`}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden ${featured ? "h-64" : "h-48"}`}>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Category Badge */}
        <Badge className="absolute top-4 left-4 bg-primary/20 text-primary border-0 backdrop-blur-sm">
          {category}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">{price}</span>
          <Button
            size="sm"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary-sm px-4"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Beli
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
