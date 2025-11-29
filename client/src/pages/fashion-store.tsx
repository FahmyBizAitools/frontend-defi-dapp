import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Text3D, Center } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, User, Heart, Menu, X } from 'lucide-react';
import { useState, Suspense } from 'react';
import * as THREE from 'three';

// 3D Product Box Component
function Product3DBox({ position, color, text }: { position: [number, number, number], color: string, text: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
}

// 3D Hero Scene
function Hero3DScene() {
  return (
    <Canvas style={{ height: '100vh', width: '100%' }}>
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff00ff" />
        <pointLight position={[10, 10, 5]} intensity={0.5} color="#00ffff" />

        <Environment preset="city" />

        <Product3DBox position={[-2, 0, 0]} color="#ff006e" text="New" />
        <Product3DBox position={[0, 0, 0]} color="#8338ec" text="Fashion" />
        <Product3DBox position={[2, 0, 0]} color="#3a86ff" text="2024" />

        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial
            color="#000000"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.5}
          />
        </mesh>
      </Suspense>
    </Canvas>
  );
}

// Navigation Bar
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              LUXE 3D
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-white hover:text-pink-500 transition-colors">Home</a>
            <a href="#shop" className="text-white hover:text-pink-500 transition-colors">Shop</a>
            <a href="#collections" className="text-white hover:text-pink-500 transition-colors">Collections</a>
            <a href="#about" className="text-white hover:text-pink-500 transition-colors">About</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-white hover:text-pink-500 transition-colors">
              <Search size={20} />
            </button>
            <button className="text-white hover:text-pink-500 transition-colors">
              <Heart size={20} />
            </button>
            <button className="text-white hover:text-pink-500 transition-colors">
              <User size={20} />
            </button>
            <button className="text-white hover:text-pink-500 transition-colors relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black/95 backdrop-blur-lg"
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            <a href="#home" className="block text-white hover:text-pink-500 py-2">Home</a>
            <a href="#shop" className="block text-white hover:text-pink-500 py-2">Shop</a>
            <a href="#collections" className="block text-white hover:text-pink-500 py-2">Collections</a>
            <a href="#about" className="block text-white hover:text-pink-500 py-2">About</a>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

// Product Card with 3D effect
function ProductCard({ product }: { product: any }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all duration-300"
    >
      <div className="aspect-square bg-gradient-to-br from-pink-500/20 to-purple-500/20 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <button className="bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-pink-500 transition-colors">
            <Heart size={20} />
          </button>
        </div>
        {product.badge && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-1 rounded-full text-white text-sm font-semibold">
            {product.badge}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-white text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{product.category}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            ${product.price}
          </span>
          <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-pink-500/50 transition-all">
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Main Fashion Store Component
export default function FashionStore() {
  const products = [
    {
      id: 1,
      name: "Cosmic Jacket",
      category: "Outerwear",
      price: 299,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
      badge: "New"
    },
    {
      id: 2,
      name: "Neon Hoodie",
      category: "Streetwear",
      price: 159,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop",
      badge: "Hot"
    },
    {
      id: 3,
      name: "Urban Sneakers",
      category: "Footwear",
      price: 189,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
      badge: "Limited"
    },
    {
      id: 4,
      name: "Future Pants",
      category: "Bottoms",
      price: 129,
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&h=500&fit=crop",
      badge: null
    },
    {
      id: 5,
      name: "Cyber Tee",
      category: "T-Shirts",
      price: 79,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      badge: "Sale"
    },
    {
      id: 6,
      name: "Matrix Sunglasses",
      category: "Accessories",
      price: 149,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
      badge: "New"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section with 3D */}
      <section id="home" className="relative h-screen">
        <Hero3DScene />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
            >
              FUTURE FASHION
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/80 mb-8"
            >
              Experience 3D Shopping Revolution
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="pointer-events-auto bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-pink-500/50 transition-all"
            >
              Explore Collection
            </motion.button>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section id="collections" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Featured Collections
            </h2>
            <p className="text-gray-400 text-lg">
              Discover our latest 3D-styled fashion pieces
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gradient-to-b from-black to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                The Future is Now
              </h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Step into the next dimension of fashion with our revolutionary 3D shopping experience.
                Each piece is carefully crafted to bring you the perfect blend of style and innovation.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our collection features cutting-edge designs that push the boundaries of contemporary fashion,
                all presented in stunning 3D for an immersive shopping journey.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 p-8 rounded-2xl border border-white/10 text-center">
                <h3 className="text-4xl font-bold text-white mb-2">500+</h3>
                <p className="text-gray-400">Products</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-8 rounded-2xl border border-white/10 text-center">
                <h3 className="text-4xl font-bold text-white mb-2">50K+</h3>
                <p className="text-gray-400">Customers</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-8 rounded-2xl border border-white/10 text-center">
                <h3 className="text-4xl font-bold text-white mb-2">100%</h3>
                <p className="text-gray-400">Quality</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/20 to-pink-500/20 p-8 rounded-2xl border border-white/10 text-center">
                <h3 className="text-4xl font-bold text-white mb-2">24/7</h3>
                <p className="text-gray-400">Support</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
                LUXE 3D
              </h3>
              <p className="text-gray-400">
                The future of fashion, today.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-pink-500 transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-pink-500 transition-colors">Best Sellers</a></li>
                <li><a href="#" className="hover:text-pink-500 transition-colors">Sale</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-pink-500 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-pink-500 transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-pink-500 transition-colors">Returns</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-pink-500 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-pink-500 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-pink-500 transition-colors">Facebook</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LUXE 3D. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
