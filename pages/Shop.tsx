import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, PlayCircle, ChevronRight, ArrowLeft, AlertCircle, Heart } from 'lucide-react';
import { Category, Product } from '../types';
import { useStore } from '../context/StoreContext';

// Updated Categories (11 Items)
const CATEGORIES: Category[] = [
  { 
      id: 'esmaltes', 
      name: 'Esmaltes', 
      image: 'https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?q=80&w=1200&auto=format&fit=crop', 
      subcategories: [
        { id: 'base', name: 'Base', image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?q=80&w=800&auto=format&fit=crop' },
        { id: 'preparadores', name: 'Preparadores', image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=800&auto=format&fit=crop' },
        { id: 'lisos', name: 'Lisos', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop' },
        { id: 'brillantes', name: 'Brillantes', image: 'https://images.unsplash.com/photo-1599693918340-02543d3b7338?q=80&w=800&auto=format&fit=crop' }
      ]
  },
  { id: 'pinceles', name: 'Pinceles', image: 'https://images.unsplash.com/photo-1513373319109-eb154073eb0b?q=80&w=1200&auto=format&fit=crop', subcategories: [] },
  { id: 'geles', name: 'Geles', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop', subcategories: [] },
  { id: 'decoracion', name: 'Decoración', image: 'https://images.unsplash.com/photo-1600056166415-38e55e5b321c?q=80&w=1200&auto=format&fit=crop', subcategories: [] },
  { id: 'combos', name: 'Combos', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop', subcategories: [] },
  { id: 'equipos', name: 'Equipos', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop', subcategories: [] },
  { id: 'sistema_aplicacion', name: 'Sistema de Aplicación', image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1200&auto=format&fit=crop', subcategories: [] },
  { id: 'spa', name: 'Spa', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop', subcategories: [] },
  { id: 'herramientas', name: 'Herramientas', image: 'https://images.unsplash.com/photo-1586221464303-349f7ba33d39?q=80&w=1200&auto=format&fit=crop', subcategories: [] },
  { id: 'implementos', name: 'Implementos', image: 'https://images.unsplash.com/photo-1576426863848-c2185fc6e818?q=80&w=1200&auto=format&fit=crop', subcategories: [] },
  { id: 'accesorios', name: 'Accesorios', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1200&auto=format&fit=crop', subcategories: [] },
];

// --- Sub-components for specific shop views ---

const CategoryList = () => (
  <div className="flex flex-col w-full">
    {CATEGORIES.map((cat) => (
      <Link key={cat.id} to={`/shop/${cat.id}`} className="group relative w-full h-40 md:h-56 overflow-hidden border-b border-white">
        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <h2 className="text-2xl md:text-5xl font-bold text-white uppercase tracking-widest drop-shadow-lg">{cat.name}</h2>
        </div>
      </Link>
    ))}
  </div>
);

const SubcategoryList = ({ categoryId }: { categoryId: string }) => {
  const category = CATEGORIES.find(c => c.id === categoryId);
  if (!category) return <div className="p-8 text-center text-xl">Categoría no encontrada</div>;

  // Logic: If category has subcategories, ONLY show subcategories.
  // If it has NO subcategories, show the products directly.
  const hasSubcategories = category.subcategories.length > 0;

  return (
    <div className="flex flex-col w-full min-h-[60vh]">
      <div className="p-4 bg-zinc-100 flex items-center gap-2 text-sm uppercase">
        <Link to="/shop" className="text-gray-500 hover:text-black">Shop</Link>
        <ChevronRight size={16} />
        <span className="font-bold">{category.name}</span>
      </div>
      
      {/* Promotional Video/Image Strip */}
      <div className="w-full h-48 md:h-64 bg-black relative mb-4 overflow-hidden">
        <img src={category.image} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center text-white flex-col">
          <h1 className="text-4xl md:text-6xl font-bold uppercase mb-2">{category.name}</h1>
          {hasSubcategories && <p className="uppercase text-sm tracking-widest">Selecciona una categoría</p>}
        </div>
      </div>

      {hasSubcategories ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {category.subcategories.map((sub) => (
            <Link key={sub.id} to={`/shop/${categoryId}/${sub.id}`} className="group relative aspect-square overflow-hidden bg-gray-200">
                <img src={sub.image} alt={sub.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-white font-bold uppercase tracking-wider text-lg border-b-2 border-transparent group-hover:border-white pb-1 transition-all">{sub.name}</span>
                </div>
            </Link>
            ))}
        </div>
      ) : (
          /* Directly show products if no subcategories exist */
          <ProductList categoryId={categoryId} subcategoryId="all" />
      )}
    </div>
  );
};

const ProductList = ({ categoryId, subcategoryId }: { categoryId: string, subcategoryId: string }) => {
  const { products, isInWishlist, toggleWishlist } = useStore();
  
  // Filter Logic
  const filteredProducts = products.filter(p => {
    if (subcategoryId === 'all') return p.category === categoryId;
    return p.category === categoryId && p.subcategory === subcategoryId;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      {subcategoryId !== 'all' && (
        <div className="mb-6 flex items-center gap-2 text-sm uppercase">
          <Link to={`/shop/${categoryId}`} className="flex items-center gap-1 text-gray-500 hover:text-black">
            <ArrowLeft size={16} /> Volver a {categoryId}
          </Link>
          <span className="text-gray-300">|</span>
          <span className="font-bold">{subcategoryId}</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filteredProducts.map(p => {
          const inWishlist = isInWishlist(p.id);
          return (
             <div key={p.id} className="block group relative">
               <div className="aspect-square bg-gray-100 mb-2 overflow-hidden relative">
                 <Link to={`/product/${p.id}`}>
                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                 </Link>
                 
                 {/* Wishlist Button on Card */}
                 <button 
                    onClick={(e) => { e.preventDefault(); toggleWishlist(p); }}
                    className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white hover:text-red-500 transition shadow-sm z-10"
                 >
                    <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} className={inWishlist ? 'text-red-500' : 'text-black'} />
                 </button>

                 {/* Low Stock Indicator for List View */}
                 {p.stock !== undefined && p.stock < 5 && p.stock > 0 && (
                   <div className="absolute bottom-0 left-0 w-full bg-white/90 py-1 text-center pointer-events-none">
                     <span className="text-[10px] uppercase font-bold text-red-700 tracking-wider">Pocas Unidades</span>
                   </div>
                 )}
                 {p.stock === 0 && (
                   <div className="absolute inset-0 bg-white/60 flex items-center justify-center pointer-events-none">
                     <span className="text-xs uppercase font-bold text-black border border-black px-2 py-1">Agotado</span>
                   </div>
                 )}
               </div>
               <Link to={`/product/${p.id}`}>
                   <h3 className="font-bold text-sm uppercase hover:underline">{p.name}</h3>
                   <p className="text-gray-600 text-xs mt-1">${p.price.toLocaleString()}</p>
               </Link>
             </div>
          );
        })}
        {filteredProducts.length === 0 && (
           <div className="col-span-4 text-center py-20 text-gray-400 uppercase bg-gray-50 rounded-lg">
               <AlertCircle className="mx-auto mb-2 opacity-50" />
               No hay productos disponibles en esta sección por el momento.
           </div>
        )}
      </div>
    </div>
  );
};

const ProductDetail = ({ productId }: { productId: string }) => {
  const { products, addToCart, isInWishlist, toggleWishlist } = useStore();
  const product = products.find(p => p.id === productId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  if (!product) return <div className="p-12 text-center">Producto no encontrado</div>;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (product.colors.length > 0 && !selectedColor) {
      alert("Por favor selecciona un color");
      return;
    }
    if (product.stock === 0) {
      alert("Producto agotado");
      return;
    }
    addToCart(product, selectedColor || undefined);
  };

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="mb-6 flex items-center gap-2 text-sm uppercase">
        <Link to={`/shop/${product.category}`} className="flex items-center gap-1 text-gray-500 hover:text-black">
          <ArrowLeft size={16} /> Volver a {product.category}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Carousel / Image */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square bg-gray-100 w-full overflow-hidden rounded-lg relative group">
             <img src={product.images[selectedImage % product.images.length]} className="w-full h-full object-cover" />
             
             {/* Wishlist Button Overlay */}
             <button 
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition z-20"
             >
                <Heart size={24} fill={inWishlist ? 'red' : 'none'} className={inWishlist ? 'text-red-500' : 'text-black'} />
             </button>

             {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                   <span className="text-2xl font-bold uppercase border-4 border-black px-8 py-4">Agotado</span>
                </div>
             )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button key={idx} onClick={() => setSelectedImage(idx)} className={`w-20 h-20 flex-shrink-0 border-2 ${selectedImage === idx ? 'border-black' : 'border-transparent'}`}>
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">{product.name}</h1>
          <p className="text-xl text-gray-600 mb-2">${product.price.toLocaleString()}</p>
          
          {/* Low Stock Indicator for Detail View */}
          {product.stock !== undefined && product.stock < 5 && product.stock > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <p className="text-xs text-red-600 font-bold uppercase tracking-wide">
                ¡Solo quedan {product.stock} unidades!
              </p>
            </div>
          )}
          
          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mb-6 mt-4">
              <h3 className="text-sm font-bold uppercase mb-3">Colores Disponibles: {product.colors.length} referencias</h3>
              <div className="grid grid-cols-8 gap-2">
                {product.colors.map((color, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border shadow-sm ${selectedColor === color ? 'border-black scale-110 ring-1 ring-offset-2 ring-black' : 'border-gray-300'}`} 
                    style={{ backgroundColor: color }} 
                    title={`Color ${idx + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase mb-2">Descripción</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-8 flex gap-4">
            <button className="text-xs uppercase font-bold border-b border-black pb-1 hover:text-gray-600">Manual de uso</button>
            <button className="text-xs uppercase font-bold border-b border-black pb-1 hover:text-gray-600 flex items-center gap-1"><PlayCircle size={12}/> Ver Video Tutorial</button>
          </div>

          <button 
            onClick={handleAddToCart} 
            disabled={product.stock === 0}
            className={`w-full py-4 uppercase font-bold tracking-widest transition ${product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-zinc-800'}`}
          >
            {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Router Wrapper for Shop
export const Shop = () => {
  const params = useParams();
  
  if (window.location.hash.includes('/product/')) {
    return <ProductDetail productId={params.id || ''} />;
  }
  
  if (params.subcategory) {
    return <ProductList categoryId={params.category!} subcategoryId={params.subcategory} />;
  }

  if (params.category) {
    return <SubcategoryList categoryId={params.category} />;
  }

  return <CategoryList />;
};